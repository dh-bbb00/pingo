import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppLoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // NestJS 내장 로거를 커스텀 AppLoggerService로 교체
  const logger = app.get(AppLoggerService);
  app.useLogger(logger);

  app.use(helmet({ contentSecurityPolicy: false }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1', { exclude: ['/docs', '/docs/json'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Pingo API')
      .setVersion('1.0')
      .addBearerAuth()
      .build(),
  );

  app.use('/docs/json', (_req: unknown, res: { json: (doc: unknown) => void }) =>
    res.json(document),
  );

  app.use('/docs', apiReference({ spec: { url: '/docs/json' } }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`서버 실행 중 — http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
