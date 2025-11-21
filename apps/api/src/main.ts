import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    app.use(cookieParser());

    app.enableCors({
        origin: frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
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