import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
        : [];
      
      const defaultAllowed = [
        'http://localhost:3000',
        'https://akm-ecommerce-pnyk.vercel.app',
      ];
      
      const allAllowed = [...defaultAllowed, ...allowedOrigins];
      
      if (!origin || allAllowed.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Cookies
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('AKM E-Commerce API')
    .setDescription('REST API for AKM clothing brand e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000; // ✅ IMPORTANT   
  await app.listen(port, '0.0.0.0');     // ✅ IMPORTANT for Render

  console.log(`🚀 AKM Backend running on http://localhost:${port}`);
  console.log(`📚 API Docs at http://localhost:${port}/api/docs`);
}
bootstrap();
