import {
  Headers,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  Ip,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { TokenService } from 'src/token/token.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { PaginatedDto } from 'src/common/dto/pagination.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly service: UserService,
    @Inject(AccessService)
    private readonly accessService: AccessService,
    @Inject(TokenService)
    private readonly TokenService: TokenService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/logged')
  async checkLogged() {
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async index(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
  ): Promise<Pagination<User>> {
    const objToken = await this.TokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    const response = this.service.findAll(query, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.VIEWED,
      'user',
      authorization,
      ip,
    );

    return response;
  }

  @Get('/search')
  async search(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
    @Body() search: { text: string },
  ): Promise<Pagination<User>> {
    const response = await this.service.search(
      search.text,
      query,
      authorization,
    );

    await this.accessService.create(
      AccessHelper.ACTION.VIEWED,
      'user',
      authorization,
      ip,
    );

    return response;
  }

  @Get('/:id')
  async findOne(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Param('id') id,
  ) {
    const user = new User();
    user.id = +id;
    const response = await this.service.findOne(user);

    await this.accessService.create(
      AccessHelper.ACTION.VIEWED,
      'user',
      authorization,
      ip,
    );

    return response;
  }

  @Post('')
  async create(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() user: CreateUserDto,
  ) {
    const response = await this.service.create(user);

    await this.accessService.create(
      AccessHelper.ACTION.ADDED,
      'user',
      'account create',
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('')
  async update(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() user: UpdateUserDto,
  ) {
    const objToken = await this.TokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    const response = await this.service.update(user, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.UPDATE,
      'comment',
      authorization,
      ip,
    );

    return response;
  }
}
