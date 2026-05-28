import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../../logger/logger.service';
import { ApiErrorCode } from '../constants/error-codes';
import { MSG } from '../constants/messages';

/** status → 기본 errorCode 매핑 (errorCode 없이 던진 예외의 폴백) */
const STATUS_DEFAULT_CODE: Partial<Record<number, ApiErrorCode>> = {
  [HttpStatus.BAD_REQUEST]:           ApiErrorCode.VALIDATION_ERROR,
  [HttpStatus.UNAUTHORIZED]:          ApiErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]:             ApiErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]:             ApiErrorCode.NOT_FOUND,
  [HttpStatus.INTERNAL_SERVER_ERROR]: ApiErrorCode.INTERNAL_ERROR,
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode: ApiErrorCode | undefined;
    let message: string;

    let extra: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      const body = exception.getResponse() as { errorCode?: ApiErrorCode; message?: string | string[]; [key: string]: unknown }
      errorCode = body.errorCode ?? STATUS_DEFAULT_CODE[status]
      const raw = body.message ?? exception.message
      // class-validator 배열 메시지는 첫 번째 값만 사용
      message = Array.isArray(raw) ? raw[0] : raw
      // errorCode·message·success 외 추가 필드(deviceAccessToken 등)를 그대로 전달
      const { errorCode: _ec, message: _msg, ...rest } = body
      extra = rest
    } else {
      errorCode = ApiErrorCode.INTERNAL_ERROR
      message = MSG.common.internalError
    }

    if (status >= 500) {
      this.logger.error(`${req.method} ${req.path}`, exception);
    }

    res.status(status).json({ success: false, errorCode, message, ...extra });
  }
}
