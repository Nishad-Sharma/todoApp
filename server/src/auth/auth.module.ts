import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core/constants';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        forwardRef(() => UsersModule), // circular dep fix
        ConfigModule,
        // need async registration as Nest inits modules in a specific order
        // static register would likely be configured before env vars loaded and break (undefined secret)
        // useFactory injects secret at runtime
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                // secret: configService.get<string>('JWT_SECRET'), // symmetric signing
                privateKey: configService.get<string>('JWT_PRIVATE_KEY'),
                publicKey: configService.get<string>('JWT_PUBLIC_KEY'),
                signOptions: { 
                    expiresIn: '10m',
                    algorithm: 'RS256'
                },
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
    exports: [AuthService, JwtModule, ConfigModule],
})
export class AuthModule {}
