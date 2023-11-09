import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CreateImageDto } from './dto/createImage.dto';
import { UploadService } from 'src/common/s3/upload.service';
import { PointService } from '../point/point.service';
import { TokenService } from 'src/token/token.service';
import { PointVote } from './entities/pointVote.entity';

@Injectable()
export class PointVoteService {
    constructor(
        @InjectRepository(PointVote)
        private readonly repository: Repository<PointVote>,
        @Inject(PointService)
        private readonly pointService: PointService,
        @Inject(UploadService)
        private readonly uploadService: UploadService,
        @Inject(TokenService)
        private readonly TokenService: TokenService,
    ) { }

    async findAll(): Promise<PointVote[]> {
        return this.repository.find();
    }
}
