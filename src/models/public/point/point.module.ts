import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/point.entity';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { AccessModule } from 'src/access/access.module';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [TypeOrmModule.forFeature([Point]), AccessModule, TokenModule],
    controllers: [PointController],
    providers: [PointService],
})
export class PointModule { }
