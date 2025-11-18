import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// Create Express instance
const expressApp = express();

// Create NestJS app with Express adapter for serverless
let app: any;

async function createNestApp() {
  if (!app) {
    const adapter = new ExpressAdapter(expressApp);
    app = await NestFactory.create(AppModule, adapter);

    // Get configuration
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Add cookie-parser middleware
    app.use(cookieParser());

    // Enable CORS
    app.enableCors({
      origin: [frontendUrl],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Set global prefix
    app.setGlobalPrefix('api');

    // Initialize the app
    await app.init();
  }
  return app;
}

// Export the handler for Vercel
export default async (req: any, res: any) => {
  await createNestApp();
  return expressApp(req, res);
};
