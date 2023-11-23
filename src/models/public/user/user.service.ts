import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { TokenService } from 'src/token/token.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @Inject(TokenService)
    private readonly TokenService: TokenService,
  ) {}

  async findAll(options): Promise<Pagination<User>> {
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

  async findOneByEmail(email: string): Promise<User> {
    const response = this.repository.findOne({
      where: {
        email,
      },
    });

    return response;
  }

  async create(userBody: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = userBody.name;
    user.birth_date = userBody.birthDate;
    user.fone = userBody.fone;
    user.cpf = userBody.cpf;
    user.email = userBody.email;
    user.password = userBody.password;
    user.status = true;
    user.type = 3;

    return this.repository.save(user);
  }

  async update(updateUserDto: UpdateUserDto, authorization: string) {
    const objToken = this.TokenService.findOne(authorization);

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
