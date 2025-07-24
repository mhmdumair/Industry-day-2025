import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    // Set up sessions
    app.use(
        session({
            secret:
                configService.get<string>('SESSION_SECRET') ?? 'fallback-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                httpOnly: true,
                secure: false, // Set to true in production
            },
        }),
    );

    // Enable CORS for frontend access (e.g., React on port 3000)
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    // Initialize passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Serve static resumes from "uploads" folder with URL prefix "/resumes"
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/resumes',
    });

    // Optional: add global API prefix (e.g., /api/route-name)
    app.setGlobalPrefix('api');

    const port = configService.get<number>('PORT') || 3001;
    await app.listen(port);

    console.log(`✅ Backend running at: http://localhost:${port}`);
    console.log(`📄 Serving resumes at: http://localhost:${port}/resumes/<file.pdf>`);
}
bootstrap();
