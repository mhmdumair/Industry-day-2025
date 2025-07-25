import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Get environment
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    // Configure session middleware FIRST
    app.use(
        session({
            secret: configService.get<string>('SESSION_SECRET') ?? 'fallback-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                httpOnly: true,
                secure: isProduction, // Use secure cookies in production
                sameSite: isProduction ? 'none' : 'lax', // Adjust for cross-origin in production
            },
        }),
    );

    // Enable CORS with dynamic origin
    app.enableCors({
        origin: [frontendUrl, 'http://localhost:3000'], // Allow both env var and fallback
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    // Initialize passport AFTER session
    app.use(passport.initialize());
    app.use(passport.session());

    // Add global validation pipe for DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip properties that don't have decorators
            forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
            transform: true, // Automatically transform payloads to DTO instances
        }),
    );

    app.setGlobalPrefix('api');

    const port = configService.get<number>('PORT') || 3001;
    await app.listen(port);

    console.log(`Application is running on: http://localhost:${port}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
    console.log(`Frontend URL: ${frontendUrl}`);
}

bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
