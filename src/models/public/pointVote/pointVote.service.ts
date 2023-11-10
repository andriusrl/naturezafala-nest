import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { PointVote } from './entities/pointVote.entity';

@Injectable()
export class PointVoteService {
    constructor(
        @InjectRepository(PointVote)
        private readonly repository: Repository<PointVote>,
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

    async create(idPoint, voteBody, authorization: string): Promise<PointVote> {
        const objToken = await this.TokenService.findOne(authorization);

        const objPointVote = await this.findByPoint({ id: idPoint, user: objToken.user })

        if (!objPointVote[0]) {
            const newPointVote = new PointVote();
            newPointVote.point = idPoint;
            newPointVote.user = objToken.user;
            newPointVote.vote = voteBody.vote;
            return this.repository.save(newPointVote)
        }

        const partialPointVote = await this.repository.preload({ ...objPointVote[0] });

        partialPointVote.vote = voteBody.vote;

        return this.repository.save(partialPointVote)
    }

    async delete(idPoint: number, authorization: string): Promise<PointVote> {

        const objToken = await this.TokenService.findOne(authorization);

        const objPointVote = await this.findByPoint({ id: idPoint, user: objToken.user })

        if (objToken.user !== objPointVote[0].user) {
            throw new NotFoundException(`Not authorized`);
        }
        return this.repository.remove(objPointVote[0]);
    }
}
