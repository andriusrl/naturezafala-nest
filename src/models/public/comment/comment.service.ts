import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly repository: Repository<Comment>,
    ) { }

    async findAll(): Promise<Comment[]> {
        return this.repository.find();
    }

    async create(comment: CreateCommentDto): Promise<Comment> {

        const newComment = new Comment();

        newComment.comment = comment.comment;
        newComment.date = comment.date;
        newComment.user = comment.user;
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
}
