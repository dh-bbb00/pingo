import {
  Injectable, ConflictException, UnauthorizedException,
  ForbiddenException, HttpException, HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AppLoggerService } from '../logger/logger.service';
import { ApprovalRequestDto } from './dto/approval-request.dto';
import { DeviceApprovalRequestDto } from './dto/device-approval-request.dto';
import { LoginDto } from './dto/login.dto';
import { MSG } from '../common/constants/messages';
import { ApiErrorCode } from '../common/constants/error-codes';
import * as bcrypt from 'bcryptjs';

/** 승인요청 rate limit: 10분 3회 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService,
  ) {}

  /** 최초 사용 승인 요청 — 신규 유저 전용. 승인된 유저의 기기 추가는 requestDeviceApproval 사용 */
  async requestApproval(dto: ApprovalRequestDto, ip: string): Promise<void> {
    await this.checkRateLimit(ip, dto.deviceUid);

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing?.status === 'APPROVED') {
      throw new ConflictException({ errorCode: ApiErrorCode.ALREADY_APPROVED, message: MSG.auth.alreadyApproved });
    }
    if (existing?.status === 'REJECTED') {
      throw new ForbiddenException({ errorCode: ApiErrorCode.REJECTED_ACCOUNT, message: MSG.auth.rejectedAccount });
    }
    if (existing?.status === 'PENDING') {
      throw new ForbiddenException({ errorCode: ApiErrorCode.PENDING_APPROVAL, message: MSG.auth.pendingApproval });
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: { password: hashed, status: 'PENDING' },
      create: { email: dto.email, password: hashed, status: 'PENDING' },
    });

    const device = await this.prisma.device.upsert({
      where: { userId_deviceUid: { userId: user.id, deviceUid: dto.deviceUid } },
      update: { deviceName: dto.deviceName, phoneModel: dto.phoneModel, osVersion: dto.osVersion, appVersion: dto.appVersion, isTrusted: false },
      create: { userId: user.id, deviceUid: dto.deviceUid, deviceName: dto.deviceName, phoneModel: dto.phoneModel, osVersion: dto.osVersion, appVersion: dto.appVersion },
    });

    await this.prisma.approvalRequest.create({
      data: { userId: user.id, deviceId: device.id, type: 'NEW_USER' },
    });

    this.logger.auth({ event: 'REGISTER_SUCCESS', email: dto.email });
  }

  /**
   * JWT 인증된 유저의 새 기기 승인 요청
   * 로그인 시 NEW_DEVICE 에러로 받은 토큰 또는 자동 로그인 토큰으로 호출
   */
  async requestDeviceApproval(userId: string, email: string, dto: DeviceApprovalRequestDto): Promise<void> {
    const device = await this.prisma.device.upsert({
      where: { userId_deviceUid: { userId, deviceUid: dto.deviceUid } },
      update: { deviceName: dto.deviceName, phoneModel: dto.phoneModel, osVersion: dto.osVersion, appVersion: dto.appVersion, isTrusted: false },
      create: { userId, deviceUid: dto.deviceUid, deviceName: dto.deviceName, phoneModel: dto.phoneModel, osVersion: dto.osVersion, appVersion: dto.appVersion },
    });

    const pending = await this.prisma.approvalRequest.findFirst({
      where: { deviceId: device.id, status: 'PENDING' },
    });
    if (pending) {
      throw new ForbiddenException({ errorCode: ApiErrorCode.DEVICE_PENDING, message: MSG.auth.devicePending });
    }

    await this.prisma.approvalRequest.create({
      data: { userId, deviceId: device.id, type: 'NEW_DEVICE' },
    });

    this.logger.auth({ event: 'DEVICE_APPROVAL_REQUESTED', email });
  }

  /**
   * 로그인 — 자격증명 확인 후 기기 상태 체크
   * - NEW_DEVICE: 미등록 기기 → deviceRegistrationToken 포함해 반환, FE가 기기 승인 요청 화면으로 이동
   * - isTrusted false: 기기 승인 대기 중
   */
  async login(dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    role: string;
    approvalStatus: string;
  }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      this.logger.auth({ event: 'LOGIN_FAIL', email: dto.email, reason: 'Invalid credentials' });
      throw new UnauthorizedException({ errorCode: ApiErrorCode.INVALID_CREDENTIALS, message: MSG.auth.invalidCredentials });
    }

    if (user.status === 'PENDING') throw new ForbiddenException({ errorCode: ApiErrorCode.PENDING_APPROVAL, message: MSG.auth.pendingApproval });
    if (user.status === 'REJECTED') throw new ForbiddenException({ errorCode: ApiErrorCode.REJECTED, message: MSG.auth.rejected });

    let device: Awaited<ReturnType<typeof this.prisma.device.findFirst>>;

    if (user.role === 'ADMIN') {
      device = await this.prisma.device.upsert({
        where: { userId_deviceUid: { userId: user.id, deviceUid: dto.deviceUid } },
        update: {},
        create: {
          userId: user.id,
          deviceUid: dto.deviceUid,
          deviceName: 'Admin',
          phoneModel: 'Admin',
          osVersion:  'Admin',
          appVersion: dto.appVersion ?? '1.0.0',
          isTrusted:  true,
        },
      });
    } else {
      device = await this.prisma.device.findFirst({
        where: { userId: user.id, deviceUid: dto.deviceUid },
      });

      if (!device) {
        // 자격증명은 확인됨 — 기기 미등록만 문제이므로 access token 발급 후 기기 승인 요청 화면으로 유도
        const accessToken = this.jwtService.sign(
          { sub: user.id, email: user.email, role: user.role },
          { secret: process.env['JWT_SECRET'], expiresIn: '1h' },
        );
        throw new ForbiddenException({ errorCode: ApiErrorCode.NEW_DEVICE, message: MSG.auth.newDevice, deviceAccessToken: accessToken });
      }

      if (!device.isTrusted) throw new ForbiddenException({ errorCode: ApiErrorCode.DEVICE_PENDING, message: MSG.auth.devicePending });
    }

    if (dto.appVersion && device.appVersion !== dto.appVersion) {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { appVersion: dto.appVersion },
      });
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role, device.id);
    this.logger.auth({ event: 'LOGIN_SUCCESS', email: user.email });
    return { ...tokens, role: user.role, approvalStatus: user.status };
  }

  /** 토큰 재발급 — DB의 refresh token 검증 후 rotation */
  async refresh(
    userId: string,
    deviceId: string,
    rawRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; role: string; approvalStatus: string; deviceUid: string }> {
    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId, deviceId, token: rawRefreshToken, expiresAt: { gt: new Date() } },
    });
    if (!stored) throw new UnauthorizedException({ errorCode: ApiErrorCode.INVALID_REFRESH_TOKEN, message: MSG.auth.invalidRefreshToken });

    const [user, device] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      this.prisma.device.findUniqueOrThrow({ where: { id: deviceId } }),
    ]);
    const tokens = await this.issueTokens(userId, user.email, user.role, deviceId);
    this.logger.auth({ event: 'TOKEN_REFRESH', email: user.email });
    return { ...tokens, role: user.role, approvalStatus: user.status, deviceUid: device.deviceUid };
  }

  /** 로그아웃 — 해당 기기의 refresh token 삭제 */
  async logout(userId: string, deviceId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId, deviceId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    this.logger.auth({ event: 'LOGOUT', email: user?.email });
  }

  /**
   * access(1h) + refresh(30d) 토큰 발급, 기존 refresh token 교체 (rotation)
   *
   * refresh token은 로그인 또는 앱 재시작(자동 로그인) 시마다 새로 발급되며,
   * 발급 시점으로부터 30일간 유효하다 (rolling 방식).
   * 즉, 30일 내에 앱을 한 번이라도 켜면 만료가 30일 연장되고,
   * 30일 동안 앱을 켜지 않으면 자동 로그인이 해제된다.
   */
  private async issueTokens(
    userId: string,
    email: string,
    role: string,
    deviceId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email, role, deviceId };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_SECRET'],
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env['JWT_REFRESH_SECRET'],
      expiresIn: '30d',
    });

    // rotation: 기존 삭제 후 새로 저장
    await this.prisma.refreshToken.deleteMany({ where: { userId, deviceId } });
    await this.prisma.refreshToken.create({
      data: {
        userId,
        deviceId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  /** IP + deviceUid 기준 10분 3회 초과 시 차단 */
  private async checkRateLimit(ip: string, deviceUid: string): Promise<void> {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

    const record = await this.prisma.approvalRateLimit.findUnique({
      where: { ip_deviceUid: { ip, deviceUid } },
    });

    if (record) {
      if (record.firstRequestAt > windowStart && record.requestCount >= RATE_LIMIT_MAX) {
        throw new HttpException({ errorCode: ApiErrorCode.RATE_LIMIT_EXCEEDED, message: MSG.auth.rateLimitExceeded }, HttpStatus.TOO_MANY_REQUESTS);
      }
      await this.prisma.approvalRateLimit.update({
        where: { ip_deviceUid: { ip, deviceUid } },
        data:
          record.firstRequestAt <= windowStart
            ? { requestCount: 1, firstRequestAt: new Date() }
            : { requestCount: { increment: 1 } },
      });
    } else {
      await this.prisma.approvalRateLimit.create({ data: { ip, deviceUid } });
    }
  }
}
