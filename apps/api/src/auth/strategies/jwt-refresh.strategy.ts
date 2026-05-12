import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: process.env['JWT_REFRESH_SECRET']!,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.deviceId) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email, role: payload.role, deviceId: payload.deviceId };
  }
}
