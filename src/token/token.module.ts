import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { TokenEntity } from './token.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/models/public/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
