import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

function checkEnv() {
  if (process.env.NODE_ENV !== 'production') return;
  if (!process.env.MONGODB_URI) {
    // Without this the app silently tries localhost and never becomes healthy.
    console.error('❌ MONGODB_URI is not set. Refusing to start in production.');
    process.exit(1);
  }
  for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) {
    if (!process.env[key]) {
      console.warn(`⚠️  ${key} is not set — falling back to an insecure default secret. Set it in your hosting environment.`);
    }
  }
}

async function bootstrap() {
  checkEnv();
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
      
      // Only explicitly listed origins. (Allowing any *.vercel.app would let any site
      // hosted on Vercel make credentialed requests to this API.)
      if (!origin || allAllowed.includes(origin)) {
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
