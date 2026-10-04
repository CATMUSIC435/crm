import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  // 1. Security & CORS
  app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // 2. Global Pipes, Filters & Interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // 3. Swagger / OpenAPI 3.0 Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NOVA CRM - Enterprise Real Estate Operating System API')
    .setDescription(
      'Hệ thống RESTful API & WebSocket Backend kiến trúc Lục Giác (Hexagonal Architecture) phục vụ 36 phân hệ BĐS cao cấp.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NOVA CRM - API Documentation',
  });

  await app.listen(port);
  logger.log(`🚀 NOVA CRM Backend đang chạy tại: http://localhost:${port}`);
  logger.log(`📑 Swagger OpenAPI Docs: http://localhost:${port}/api/docs`);
  logger.log(`⚡ WebSocket Auction Gateway: ws://localhost:${port}/ws/auction`);
}

bootstrap();
