import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
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

    async findAllByPoint(id: number): Promise<PointVote[]> {
        return this.repository.find({
            select: {
                vote: true,
            },
            where: {
                point: Equal(id)
            }
        });
    }

    async findByPoint(point: { id: number, authorization?: string, user?: number }): Promise<PointVote[]> {

        if (point?.user) {
            return this.repository.find({
                where: {
                    point: Equal(point.id),
                    user: Equal(point.user)
                }
            });
        }

        const objToken = await this.TokenService.findOne(point.authorization);

        return this.repository.find({
            where: {
                point: Equal(point.id),
                user: Equal(objToken.user)
            }
        });
    }

    async create(idPoint, voteBody, authorization: string) {
        const objToken = await this.TokenService.findOne(authorization);

        const objPointVote = await this.findByPoint({ id: idPoint, user: objToken.user })

        const pointVotePreload = await this.repository.preload(objPointVote[0]);


        pointVotePreload.vote = voteBody.vote;


        return this.repository.save(pointVotePreload)
    }
}
