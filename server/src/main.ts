import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // helmet sets secure http response headers. helps with clickjacking, xss attacks, prevents mime sniffing.
    app.use(helmet());

    // restricts cross-domain requests. we allow frontend to access api 
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // allow cookies/auth headers -req for jwt auth
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
