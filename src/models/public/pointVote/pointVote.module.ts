import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointModule } from '../point/point.module';
import { UploadService } from 'src/common/s3/upload.service';
import { TokenModule } from 'src/token/token.module';
import { PointVote } from './entities/pointVote.entity';
import { PointVoteService } from './pointVote.service';
import { PointVoteController } from './pointVote.controller';
import { AccessModule } from 'src/access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([PointVote]), PointModule, TokenModule, AccessModule],
    controllers: [PointVoteController],
    providers: [PointVoteService, UploadService],
})
export class PointVoteModule { }
