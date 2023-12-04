import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { TokenService } from 'src/token/token.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Pagination, paginateRaw } from 'nestjs-typeorm-paginate';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async findAll(
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<User>> {
    try {
      const objToken = await this.tokenService.findOne(authorization);

      if (objToken.user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
      const skip = (options.page - 1) * options.limit;
      const [response, total] = await this.repository.findAndCount({
        take: options.limit,
        skip: skip,
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

  async findOne(user: User): Promise<User> {
    if (user?.id) {
      const response = this.repository.findOne({
        where: {
          id: user?.id,
        },
      });

      return response;
    }
    const response = this.repository.findOne({
      where: {
        email: user.email,
      },
    });

    return response;
  }

  async search(
    search: string,
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<User>> {
    try {
      const objToken = await this.tokenService.findOne(authorization);

      if (objToken.user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }

      const skip = (options.page - 1) * options.limit;
      const [response, total] = await this.repository.findAndCount({
        take: options.limit,
        skip: skip,
        where: {
          name: ILike(`%${search}%`),
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

  async findOneByEmail(email: string): Promise<User> {
    const response = this.repository.findOne({
      where: {
        email,
      },
    });

    return response;
  }

  async create(userBody: CreateUserDto): Promise<User> {
    try {
      const user = new User();

      user.name = userBody.name;
      user.birthDate = userBody.birthDate;
      user.fone = userBody.fone;
      user.cpf = userBody.cpf;
      user.email = userBody.email;
      user.password = userBody.password;
      user.status = true;
      user.type = 3;

      const response = await this.repository.save(user);

      return response;
    } catch (err) {
      throw new NotFoundException(err?.constraint);
    }
  }

  async update(updateUserDto: UpdateUserDto, authorization: string) {
    const objToken = this.tokenService.findOne(authorization);

    const user = this.repository.findOne({ where: { id: updateUserDto.id } });

    const objPromise = await Promise.all([objToken, user]);

    if (objPromise[0].user.id !== objPromise[1].id) {
      if (objPromise[0].user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
    }

    if (!user) {
      throw new NotFoundException(`User ID ${objPromise[1].id} not found`);
    }

    await this.repository.update({ id: updateUserDto.id }, updateUserDto);

    return updateUserDto;
  }
}
