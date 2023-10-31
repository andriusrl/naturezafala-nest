import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/typeorm/typeorm.service';
import { UserModule } from './models/public/user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { PointModule } from './models/public/point/point.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    TokenModule,
    UserModule,
    PointModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
