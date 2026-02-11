import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ // load env vars
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'database.sqlite',
        autoLoadEntities: true,
        synchronize: true, // disable in prod - can cause data loss, auto updates db schema to match entities
    }),
    ThrottlerModule.forRoot({
        throttlers: [
            {
                ttl: 60000,
                limit: 5,
            }
        ]
    }),
    UsersModule,
    TodosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {
        console.log('Is connected to DB: ', this.dataSource.isInitialized);
    }
    
}
