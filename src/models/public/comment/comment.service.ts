import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from 'src/token/token.service';
import { Equal, Repository } from 'typeorm';
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

    async findAllByPoint(id: number): Promise<Comment[]> {
        return this.repository.find({
            select: {
                id: true,
                comment: true,
                date: true,
                user: true,
                point: {name: true}
            },
            relations: { point: true, },
            where: {
                point: Equal(id)
            }
        });
    }

    async create(comment: CreateCommentDto, authorization: string): Promise<Comment> {
        const objToken = await this.TokenService.findOne(authorization);

        console.log('objtoken q q q')
        console.log(objToken.user.id)

        const newComment = new Comment();

        newComment.comment = comment.comment;
        newComment.date = comment.date;
        newComment.user = objToken.user.id;
        newComment.point = comment.point;

        return this.repository.save(newComment)
    }

    async update(updateCommentDto: UpdateCommentDto, authorization: string) {

        const objToken = this.TokenService.findOne(authorization);

        const comment = this.repository.findOne({ where: { id: updateCommentDto.id } });

        const objPromise = await Promise.all([objToken, comment]);

        if (objPromise[0].user.id !== objPromise[1].user) {
            throw new NotFoundException(`Not authorized`);
        }

        if (!comment) {
            throw new NotFoundException(`Comment ID ${updateCommentDto.id} not found`);
        }

        await this.repository.update({ id: updateCommentDto.id }, updateCommentDto)

        return updateCommentDto;
    }

    async delete(id: number, authorization: string) {

        const objToken = this.TokenService.findOne(authorization);

        const comment = await this.repository.findOne({ where: { id } });

        const objPromise = await Promise.all([objToken, comment]);

        if (objPromise[0].user.id !== objPromise[1].user) {
            throw new NotFoundException(`Not authorized`);
        }

        if (!comment) {
            throw new NotFoundException(`Comment ID ${id} not found`);
        }

        return this.repository.remove(comment);
    }
}
