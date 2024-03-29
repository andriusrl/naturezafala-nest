import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from 'src/token/token.service';
import { Equal, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { Comment } from './entities/comment.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    @Inject(TokenService)
    private readonly TokenService: TokenService,
  ) { }

  async findAll(): Promise<Comment[]> {
    return this.repository.find();
  }

  // async findAllByPoint(id: number, options): Promise<Comment[]> {
  async findAllByPoint(id: number, options): Promise<Pagination<Comment>> {
    const skip = (options.page - 1) * options.limit;
    const [response, total] = await this.repository.findAndCount({
      select: {
        id: true,
        comment: true,
        date: true,
        user: { name: true },
        point: { name: true },
      },
      relations: { point: true, user: true },
      where: {
        point: Equal(id),
      },
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
  }

  async create(
    comment: CreateCommentDto,
    authorization: string,
  ): Promise<Comment> {
    const objToken = await this.TokenService.findOne(authorization);

    const newComment = new Comment();

    const userObj = new User();

    userObj.id = objToken.user.id;

    newComment.comment = comment.comment;
    newComment.date = new Date();
    newComment.user = userObj;
    newComment.point = comment.point;

    return this.repository.save(newComment);
  }

  async update(updateCommentDto: UpdateCommentDto, authorization: string) {
    const objToken = this.TokenService.findOne(authorization);

    const comment = this.repository.findOne({
      where: { id: updateCommentDto.id },
    });

    const objPromise = await Promise.all([objToken, comment]);

    const commentUser = new User();
    commentUser.id = objPromise[1].user.id;

    if (objPromise[0].user.id !== commentUser.id) {
      if (objPromise[0].user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
    }

    if (!comment) {
      throw new NotFoundException(
        `Comment ID ${updateCommentDto.id} not found`,
      );
    }

    await this.repository.update({ id: updateCommentDto.id }, updateCommentDto);

    return updateCommentDto;
  }

  async delete(id: number, authorization: string) {
    const objToken = this.TokenService.findOne(authorization);

    const comment = await this.repository.findOne({ where: { id } });

    const objPromise = await Promise.all([objToken, comment]);

    const commentUser = new User();
    commentUser.id = objPromise[1].user.id;

    if (objPromise[0].user.id !== commentUser.id) {
      throw new NotFoundException(`Not authorized`);
    }

    if (!comment) {
      throw new NotFoundException(`Comment ID ${id} not found`);
    }

    return this.repository.remove(comment);
  }
}
