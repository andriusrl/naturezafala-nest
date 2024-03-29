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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { PaginatedDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('comment')
export class CommentController {
  constructor(
    @Inject(CommentService)
    private readonly service: CommentService,
    private readonly accessService: AccessService,
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async index(): Promise<Comment[]> {
    return this.service.findAll();
  }

  @Get('/point/:id')
  async findCommentsByPoint(
    @Param('id') id: string,
    @Query() query: PaginatedDto,
  ): Promise<Pagination<Comment>> {
    return this.service.findAllByPoint(+id, query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async create(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() comment,
    // @Body() comment: CreateCommentDto,
  ) {

    console.log('body comment')
    console.log(comment)
    const response = await this.service.create(comment, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.ADDED,
      'comment',
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('')
  async update(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() comment: UpdateCommentDto,
  ) {
    const response = await this.service.update(comment, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.UPDATE,
      'comment',
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
      AccessHelper.ACTION.UPDATE,
      'comment',
      authorization,
      ip,
    );

    return response;
  }
}
