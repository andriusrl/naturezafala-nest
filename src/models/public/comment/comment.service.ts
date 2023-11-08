import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from 'src/token/token.service';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { Comment } from './entities/comment.entity';

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

    async create(comment: CreateCommentDto, authorization: string): Promise<Comment> {

        const objToken = await this.TokenService.findOne(authorization);

        const newComment = new Comment();

        newComment.comment = comment.comment;
        newComment.date = comment.date;
        newComment.user = objToken.user;
        newComment.point = comment.point;

        return this.repository.save(newComment)
    }

    async update(updateCommentDto: UpdateCommentDto) {

        const comment = await this.repository.findOne({ where: { id: updateCommentDto.id } });

        if (!comment) {
            throw new NotFoundException(`Comment ID ${updateCommentDto.id} not found`);
        }

        await this.repository.update({ id: updateCommentDto.id }, updateCommentDto)

        return updateCommentDto;
    }

    async delete(id: number) {
        const comment = await this.repository.findOne({ where: { id } });

        if (!comment) {
            throw new NotFoundException(`Comment ID ${id} not found`);
        }

        return this.repository.remove(comment);
    }
}
