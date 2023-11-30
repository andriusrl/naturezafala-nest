import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { PointVote } from './entities/pointVote.entity';
import { Pagination, paginateRaw } from 'nestjs-typeorm-paginate';

@Injectable()
export class PointVoteService {
  constructor(
    @InjectRepository(PointVote)
    private readonly repository: Repository<PointVote>,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async findAll(): Promise<PointVote[]> {
    return this.repository.find();
  }

  async findMostVoted(
    authorization: string,
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
  ): Promise<Pagination<PointVote>> {
    const objToken = await this.tokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    const queryBuilder = await this.repository
      .createQueryBuilder('pointvote')
      .select('pointvote.user', 'userId')
      .addSelect('COUNT(pointvote.user)', 'count')
      .groupBy('pointvote.user')
      .orderBy('count', 'DESC');

    return paginateRaw(queryBuilder, {
      limit: options.limit,
      page: options.page,
    });
  }

  async findAllByPoint(id: number, authorization: string) {
    const responseTrue = this.repository.findAndCount({
      select: {
        vote: true,
      },
      where: {
        point: Equal(id),
        vote: Equal(true),
      },
    });

    const responseFalse = this.repository.findAndCount({
      select: {
        vote: true,
      },
      where: {
        point: Equal(id),
        vote: Equal(false),
      },
    });

    const response = await Promise.all([responseTrue, responseFalse]);

    const objToken = await this.tokenService.findOne(authorization);

    const responseUser = await this.repository.findAndCount({
      select: {
        vote: true,
      },
      where: {
        point: Equal(id),
        user: Equal(objToken.user.id),
      },
    });

    if (responseUser[0][0]?.vote !== undefined) {
      return {
        true: response[0][1],
        false: response[1][1],
        vote: responseUser[0][0]?.vote,
      };
    }

    return { true: response[0][1], false: response[1][1] };
  }

  async findByPoint(point: {
    id: number;
    authorization?: string;
    user?: number;
  }): Promise<PointVote[]> {
    if (point?.user) {
      return this.repository.find({
        where: {
          point: Equal(point.id),
          user: Equal(point.user),
        },
      });
    }

    const objToken = await this.tokenService.findOne(point.authorization);

    return this.repository.find({
      where: {
        point: Equal(point.id),
        user: Equal(objToken.user),
      },
    });
  }

  async create(idPoint, voteBody, authorization: string): Promise<PointVote> {
    const objToken = await this.tokenService.findOne(authorization);

    const objPointVote = await this.findByPoint({
      id: idPoint,
      user: objToken.user.id,
    });

    if (!objPointVote[0]) {
      const newPointVote = new PointVote();
      newPointVote.point = idPoint;
      newPointVote.user = objToken.user;
      newPointVote.vote = voteBody.vote;
      return this.repository.save(newPointVote);
    }

    const partialPointVote = await this.repository.preload({
      ...objPointVote[0],
    });

    partialPointVote.vote = voteBody.vote;

    await this.repository.update(
      { point: idPoint, user: objToken.user },
      partialPointVote,
    );

    return partialPointVote;
  }

  async delete(idPoint: number, authorization: string): Promise<PointVote> {
    const objToken = await this.tokenService.findOne(authorization);

    const objPointVote = await this.findByPoint({
      id: idPoint,
      user: objToken.user.id,
    });

    if (objToken.user !== objPointVote[0].user) {
      throw new NotFoundException(`Not authorized`);
    }
    return this.repository.remove(objPointVote[0]);
  }
}
