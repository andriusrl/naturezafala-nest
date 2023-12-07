import {
  Headers,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  Delete,
  Patch,
  Ip,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointService } from './point.service';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './dto/createPoint.dto';
import { UpdatePointDto } from './dto/updatePoint.dto';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { PaginatedDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('point')
export class PointController {
  constructor(
    @Inject(PointService)
    private readonly service: PointService,
    private readonly accessService: AccessService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async findAll(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
    // ): Promise<Pagination<Point>> {
  ) {
    return this.service.findAll(query, authorization);
  }

  @Get('/mypoints')
  async findMyPoints(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
  ): Promise<Pagination<Point>> {
    const response = await this.service.findMyPoints(query, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.VIEWED,
      'user',
      authorization,
      ip,
    );

    return response;
  }

  @Get('/km/:lat/:long/:km')
  async findAllKm(
    @Param('lat') lat,
    @Param('long') long,
    @Param('km') km,
  ): Promise<Point[]> {
    return this.service.findAllKm(Number(lat), Number(long), Number(km));
  }

  @Get('/:id')
  async findOne(
    @Ip() ip,
    @Param('id') id,
    @Headers('authorization') authorization: string,
  ) {
    const response = await this.service.findOne(+id, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.VIEWED,
      'point',
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createPoint(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() point: CreatePointDto,
  ) {
    const response = this.service.createPoint(point, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.ADDED,
      'ponto',
      authorization,
      ip,
    );

    return response;
  }

  @Post('/search')
  async search(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    // @Ip() ip,
    @Body() search: { text: string },
  ): Promise<Pagination<Point>> {
    const response = await this.service.search(
      search.text,
      query,
      authorization,
    );

    // await this.accessService.create(
    //   AccessHelper.ACTION.VIEWED,
    //   'user',
    //   authorization,
    //   ip,
    // );

    return response;
  }

  @Post('/city/search')
  async citySearch(@Body() search: { text: string }) {
    const response = await this.service.searchCity(search.text);

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/')
  async updatePoint(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() point: UpdatePointDto,
  ) {
    const response = await this.service.update(point, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.UPDATE,
      'ponto',
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteFile(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Param('id') id,
  ) {
    const response = await this.service.delete(+id, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.DELETE,
      'ponto',
      authorization,
      ip,
    );

    return response;
  }
}
