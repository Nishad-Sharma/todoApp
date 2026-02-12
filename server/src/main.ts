import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // Strips out properties that aren't in your DTO (Security best practice)
        forbidNonWhitelisted: true, // Throws error if extra properties are sent
    }));

    // helmet sets secure http response headers. helps with clickjacking, xss attacks, prevents mime sniffing.
    app.use(helmet());
    app.use(cookieParser());
    // restricts cross-domain requests. we allow frontend to access api 
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // allow cookies/auth headers -req for jwt auth
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
