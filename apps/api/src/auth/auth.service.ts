import {
  Injectable, ConflictException, UnauthorizedException,
  ForbiddenException, HttpException, HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AppLoggerService } from '../logger/logger.service';
import { ApprovalRequestDto } from './dto/approval-request.dto';
import { LoginDto } from './dto/login.dto';
import { MSG } from '../common/constants/messages';
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

  /** 사용 승인 요청 — 유저/기기 upsert 후 ApprovalRequest 생성 */
  async requestApproval(dto: ApprovalRequestDto, ip: string): Promise<void> {
    await this.checkRateLimit(ip, dto.deviceUid);

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing?.status === 'APPROVED') {
      throw new ConflictException(MSG.auth.alreadyApproved);
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: { password: hashed, status: 'PENDING' },
      create: { email: dto.email, password: hashed, status: 'PENDING' },
    });

    const device = await this.prisma.device.upsert({
      where: { userId_deviceUid: { userId: user.id, deviceUid: dto.deviceUid } },
      update: {
        deviceName: dto.deviceName,
        phoneModel: dto.phoneModel,
        osVersion: dto.osVersion,
        appVersion: dto.appVersion,
        isTrusted: false,
      },
      create: {
        userId: user.id,
        deviceUid: dto.deviceUid,
        deviceName: dto.deviceName,
        phoneModel: dto.phoneModel,
        osVersion: dto.osVersion,
        appVersion: dto.appVersion,
      },
    });

    await this.prisma.approvalRequest.create({
      data: { userId: user.id, deviceId: device.id },
    });

    this.logger.auth({ event: 'REGISTER_SUCCESS', email: dto.email });
  }

  /**
   * 로그인 — 자격증명 확인 후 기기 상태 체크
   * - NEW_DEVICE: 신규 기기 → 클라이언트가 기기변경 화면으로 이동
   * - isTrusted false: 기기 승인 대기 중
   */
  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      this.logger.auth({ event: 'LOGIN_FAIL', email: dto.email, reason: 'Invalid credentials' });
      throw new UnauthorizedException(MSG.auth.invalidCredentials);
    }

    if (user.status === 'PENDING') throw new ForbiddenException(MSG.auth.pendingApproval);
    if (user.status === 'REJECTED') throw new ForbiddenException(MSG.auth.rejected);

    const device = await this.prisma.device.findFirst({
      where: { userId: user.id, deviceUid: dto.deviceUid },
    });

    // 기기 미등록 → 기기변경 감지 (클라이언트가 이 메시지로 기기변경 화면 분기)
    if (!device) throw new ForbiddenException(MSG.auth.newDevice);

    // 기기 미승인
    if (!device.isTrusted) throw new ForbiddenException(MSG.auth.devicePending);

    // 앱 버전 변경 시 업데이트
    if (dto.appVersion && device.appVersion !== dto.appVersion) {
      await this.prisma.device.update({
        where: { id: device.id },
        data: { appVersion: dto.appVersion },
      });
    }

    const tokens = await this.issueTokens(user.id, user.email, user.role, device.id);
    this.logger.auth({ event: 'LOGIN_SUCCESS', email: user.email });
    return tokens;
  }

  /** 토큰 재발급 — DB의 refresh token 검증 후 rotation */
  async refresh(
    userId: string,
    deviceId: string,
    rawRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const stored = await this.prisma.refreshToken.findFirst({
      where: { userId, deviceId, token: rawRefreshToken, expiresAt: { gt: new Date() } },
    });
    if (!stored) throw new UnauthorizedException(MSG.auth.invalidRefreshToken);

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const tokens = await this.issueTokens(userId, user.email, user.role, deviceId);
    this.logger.auth({ event: 'TOKEN_REFRESH', email: user.email });
    return tokens;
  }

  /** 로그아웃 — 해당 기기의 refresh token 삭제 */
  async logout(userId: string, deviceId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId, deviceId } });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    this.logger.auth({ event: 'LOGOUT', email: user?.email });
  }

  /** access(1h) + refresh(30d) 토큰 발급, 기존 refresh token 교체 */
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
        throw new HttpException(MSG.auth.rateLimitExceeded, HttpStatus.TOO_MANY_REQUESTS);
      }
      // 윈도우 만료 시 초기화, 아니면 카운트 증가
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
