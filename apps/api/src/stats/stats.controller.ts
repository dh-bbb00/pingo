import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { StatsQueryDto } from './dto/stats-query.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BasicResponse } from '../common/types/response.type';

@ApiTags('Stats')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /** 도넛 차트 데이터 — 카테고리별 지출 합계 + 비율 */
  @Get('by-category')
  @ApiOperation({ summary: '카테고리별 지출 통계' })
  async byCategory(
    @CurrentUser() user: { id: string },
    @Query() query: StatsQueryDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.statsService.getByCategory(user.id, query);
    return { success: true, data };
  }

  /** 막대 차트 데이터 — 일별 지출 합계 */
  @Get('by-date')
  @ApiOperation({ summary: '일별 지출 통계' })
  async byDate(
    @CurrentUser() user: { id: string },
    @Query() query: StatsQueryDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.statsService.getByDate(user.id, query);
    return { success: true, data };
  }

  /** 막대 차트 데이터 — 시간대별 지출 합계 (일 탭) */
  @Get('by-hour')
  @ApiOperation({ summary: '시간대별 지출 통계' })
  async byHour(
    @CurrentUser() user: { id: string },
    @Query() query: StatsQueryDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.statsService.getByHour(user.id, query);
    return { success: true, data };
  }

  /** 홈 대시보드 — 이번달 요약, 카테고리별 TOP, 최근 5건, 6개월 추이 */
  @Get('home-summary')
  @ApiOperation({ summary: '홈 대시보드 요약' })
  async homeSummary(
    @CurrentUser() user: { id: string },
  ): Promise<BasicResponse<unknown>> {
    const data = await this.statsService.getHomeSummary(user.id);
    return { success: true, data };
  }

  /** 월별 지출 추이 — 선 그래프 데이터 */
  @Get('by-month')
  @ApiOperation({ summary: '월별 지출 통계' })
  async byMonth(
    @CurrentUser() user: { id: string },
    @Query() query: StatsQueryDto,
  ): Promise<BasicResponse<unknown>> {
    const data = await this.statsService.getByMonth(user.id, query);
    return { success: true, data };
  }
}
