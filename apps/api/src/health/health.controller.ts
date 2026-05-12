import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/** 서버 상태 확인용 — 로드밸런서·헬스체크에서 인증 없이 호출 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: '서버 상태 확인' })
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
