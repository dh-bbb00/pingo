import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../../logger/logger.service';

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

    const message =
      exception instanceof HttpException
        ? ((exception.getResponse() as { message?: string | string[] })?.message ?? exception.message)
        : 'Internal server error';

    if (status >= 500) {
      this.logger.error(`${req.method} ${req.path}`, exception);
    }

    res.status(status).json({ success: false, message });
  }
}
