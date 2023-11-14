import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenModule } from 'src/token/token.module';
import { AccessModule } from 'src/access/access.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => TokenModule), AccessModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
