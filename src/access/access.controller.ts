import {
  Headers,
  Controller,
  Get,
  Inject,
  UseGuards,
  Ip,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { TokenService } from 'src/token/token.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginatedDto } from 'src/common/dto/pagination.dto';
import Access from './entities/access.entity';

@Controller('access')
export class AccessController {
  constructor(
    @Inject(AccessService)
    private readonly service: AccessService,
    @Inject(AccessService)
    private readonly accessService: AccessService,
    @Inject(TokenService)
    private readonly TokenService: TokenService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async findAll(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
  ) {
    // ): Promise<Pagination<Access>> {
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

  @UseGuards(AuthGuard('jwt'))
  @Get('/myaccess')
  async findMyAccess(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
  ) {
    // ): Promise<Pagination<Access>> {
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
}
