import {
  Body,
  Headers,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Ip,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointVote } from './entities/pointVote.entity';
import { PointVoteService } from './pointVote.service';
import { CreatePointVoteDto } from './dto/createPointVote.dto';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { PaginatedDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('pointvote')
export class PointVoteController {
  constructor(
    @Inject(PointVoteService)
    private readonly service: PointVoteService,
    private readonly accessService: AccessService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async index(): Promise<PointVote[]> {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/mostvoted')
  async findMostVoted(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
  ): Promise<Pagination<PointVote>> {
    return this.service.findMostVoted(authorization, query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/findone')
  async findOne(
    @Headers('authorization') authorization: string,
    @Query() query: { point; user },
  ) {
    return this.service.findOne(query?.user, query?.point);
  }

  @Get('/point/:id')
  async findCommentsByPoint(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    return this.service.findAllByPoint(+id, authorization);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:idPoint')
  async create(
    @Param('idPoint') idPoint: string,
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() voteBody: CreatePointVoteDto,
  ) {
    const response = await this.service.create(
      idPoint,
      voteBody,
      authorization,
    );

    await this.accessService.create(
      AccessHelper.ACTION.ADDED,
      `point ${idPoint} Vote ${voteBody ? 'true' : 'false'}`,
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:idPoint')
  async delete(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Param('idPoint') idPoint,
  ) {
    const response = await this.service.delete(+idPoint, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.DELETE,
      `vote point`,
      authorization,
      ip,
    );

    return response;
  }
}
