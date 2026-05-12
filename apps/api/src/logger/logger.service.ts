import { Injectable } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

type AuthEvent =
  | 'LOGIN_SUCCESS' | 'LOGIN_FAIL' | 'LOGOUT' | 'TOKEN_REFRESH'
  | 'SESSION_EXPIRED' | 'UNAUTHORIZED' | 'FORBIDDEN'
  | 'REGISTER_SUCCESS' | 'REGISTER_FAIL';

export type ApiLogOptions = {
  method: string;
  path: string;
  status: number;
  duration: number;
  user?: { id: string; email: string; role: string };
  reqBody?: unknown;
  resBody?: unknown;
};

export type AuthLogOptions = {
  event: AuthEvent;
  email?: string;
  path?: string;
  reason?: string;
};

const SENSITIVE_KEYS = ['password', 'token', 'secret'];
const LINE = '─'.repeat(72);

function maskSensitive(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body;
  return Object.fromEntries(
    Object.entries(body as Record<string, unknown>).map(([k, v]) => [
      k,
      SENSITIVE_KEYS.some((s) => k.toLowerCase().includes(s)) ? '***' : v,
    ]),
  );
}

function statusIcon(status: number): string {
  if (status >= 500) return '✗';
  if (status >= 400) return '△';
  return '✓';
}

function authIcon(event: AuthEvent): string {
  return (['LOGIN_SUCCESS', 'TOKEN_REFRESH', 'LOGOUT', 'REGISTER_SUCCESS'] as AuthEvent[]).includes(event)
    ? '✓'
    : '△';
}

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly winston: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.printf(({ message }) => message as string),
      }),
    ];

    if (process.env['NODE_ENV'] === 'production') {
      const logsDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const DailyRotateFile = require('winston-daily-rotate-file');
      transports.push(
        new DailyRotateFile({
          dirname: logsDir,
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          format: winston.format.printf(({ message }) => message as string),
        }) as winston.transport,
      );
    }

    this.winston = winston.createLogger({ transports });
  }

  api({ method, path: reqPath, status, duration, user, reqBody, resBody }: ApiLogOptions): void {
    const icon = statusIcon(status);
    const now = new Date().toISOString();
    const lines = [
      `┌${LINE}`,
      `│ ← ${method.padEnd(6)} ${reqPath}`,
      `│    ${now}`,
      `│    user: ${user ? `${user.email} [${user.role}]` : '(anonymous)'}`,
      ...(reqBody ? [`│    req : ${JSON.stringify(maskSensitive(reqBody))}`] : []),
      `├${LINE}`,
      `│ → ${icon} ${status}  (${duration}ms)`,
      ...(resBody ? [`│    res : ${JSON.stringify(maskSensitive(resBody))}`] : []),
      `└${LINE}`,
    ];
    this.winston.info(lines.join('\n'));
  }

  auth({ event, email, path: reqPath, reason }: AuthLogOptions): void {
    const icon = authIcon(event);
    const now = new Date().toISOString();
    const parts = [`[${now}] AUTH ${icon} ${event}`];
    if (email) parts.push(`[${email}]`);
    if (reqPath) parts.push(`path: ${reqPath}`);
    if (reason) parts.push(`reason: ${reason}`);
    this.winston.info(parts.join('  '));
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.info(`[${new Date().toISOString()}] INFO   ${message}${optionalParams.length ? ' ' + optionalParams.join(' ') : ''}`);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    const trace = optionalParams[0];
    this.winston.error(
      `[${new Date().toISOString()}] ERROR  ${message}${trace instanceof Error ? '\n' + trace.stack : trace ? '\n' + String(trace) : ''}`,
    );
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.winston.warn(`[${new Date().toISOString()}] WARN   ${message}${optionalParams.length ? ' ' + optionalParams.join(' ') : ''}`);
  }

  debug(message: unknown): void {
    this.winston.debug(`[${new Date().toISOString()}] DEBUG  ${message}`);
  }

  verbose(message: unknown): void {
    this.winston.verbose(`[${new Date().toISOString()}] VERB   ${message}`);
  }
}
