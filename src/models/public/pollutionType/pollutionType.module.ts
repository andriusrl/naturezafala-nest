import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollutionType } from './entities/pollutionType.entity';
import { PollutionTypeService } from './pollutionType.service';
import { AccessModule } from 'src/access/access.module';
import { PollutionTypeController } from './pollutionType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PollutionType]), AccessModule],
  controllers: [PollutionTypeController],
  providers: [PollutionTypeService],
})
export class PollutionTypeModule { }
