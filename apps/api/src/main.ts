import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet({ contentSecurityPolicy: false }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    credentials: true,
  });

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
}

bootstrap();
