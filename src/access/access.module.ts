import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccessEntity from './entities/access.entity';
import { AccessService } from './access.service';
import { TokenModule } from 'src/token/token.module';
import { AccessController } from './access.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessEntity]),
    forwardRef(() => TokenModule),
  ],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
