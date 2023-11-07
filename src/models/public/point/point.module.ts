import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { AccessModule } from 'src/access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([Point]), AccessModule],
    controllers: [PointController],
    providers: [PointService],
})
export class PointModule { }
