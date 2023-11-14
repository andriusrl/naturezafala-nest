import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/models/public/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenModule } from '../token/token.module';
import { User } from 'src/models/public/user/entities/user.entity';
import { AccessModule } from 'src/access/access.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    forwardRef(() => UserModule),
    forwardRef(() => TokenModule),
    forwardRef(() => AccessModule),
    JwtModule.register({
      privateKey: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: '10000s',
      },
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
