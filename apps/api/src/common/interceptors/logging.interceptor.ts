import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AppLoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request & { user?: { id: string; email: string; role: string } }>();
    const res = context.switchToHttp().getResponse<Response>();
    const { method, path, body } = req;
    const start = Date.now();

    if (path.endsWith('/health')) {
      return next.handle().pipe(
        tap(() => this.logger.debug(`health check  (${Date.now() - start}ms)`)),
      );
    }

    return next.handle().pipe(
      tap((resBody) => {
        this.logger.api({
          method,
          path,
          status: res.statusCode,
          duration: Date.now() - start,
          user: req.user,
          reqBody: body,
          resBody,
        });
      }),
    );
  }
}
