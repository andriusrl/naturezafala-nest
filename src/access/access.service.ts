import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { TokenService } from '../token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import AccessEntity from './entities/access.entity';
import Access from './entities/access.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly repository: Repository<AccessEntity>,
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
  ) {}
  async create(
    action: number,
    description: string,
    token: string,
    ip?: string,
  ) {
    const objToken = await this.tokenService.findOne(token);

    let ipConverted = ip;
    if (ip?.substr(0, 7) == '::ffff:') {
      ipConverted = ip.substr(7);
    }

    const access = new AccessEntity();

    access.user_id = objToken?.user?.id;
    access.action = action;
    access.description = description;
    access.ip = ipConverted;

    return this.repository.save(access);
  }

  async findAll(
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<Access>> {
    try {
      const objToken = await this.tokenService.findOne(authorization);

      if (objToken.user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
      const skip = (options.page - 1) * options.limit;
      const [response, total] = await this.repository.findAndCount({
        take: options.limit,
        skip: skip,
        order: {
          id: 'DESC',
        },
      });

      const totalPages = Math.ceil(total / options.limit);

      return {
        items: response,
        meta: {
          totalItems: total,
          totalPages: totalPages,
          itemsPerPage: Number(options.limit),
          currentPage: Number(options.page),
          itemCount: response.length,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }

  async findMyAccess(
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<Access>> {
    try {
      const objToken = await this.tokenService.findOne(authorization);

      const skip = (options.page - 1) * options.limit;
      const [response, total] = await this.repository.findAndCount({
        take: options.limit,
        skip: skip,
        select: {
          id: true,
          action: true,
          description: true,
          ip: true,
          date: true,
        },
        where: {
          user_id: Equal(objToken.user.id),
        },
        order: {
          id: 'DESC',
        },
      });

      const totalPages = Math.ceil(total / options.limit);

      return {
        items: response,
        meta: {
          totalItems: total,
          totalPages: totalPages,
          itemsPerPage: Number(options.limit),
          currentPage: Number(options.page),
          itemCount: response.length,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }
}
