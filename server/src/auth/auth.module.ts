import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        UsersModule,
        // need async registration as Nest inits modules in a specific order
        // static register would likely be configured before env vars loaded and break (undefined secret)
        // useFactory injects secret at runtime
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                // 2do maybe throw error if secret not pulled??
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '10m' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        }
    ],
    exports: [AuthService]
})
export class AuthModule {}
