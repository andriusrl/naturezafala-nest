import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly repository: Repository<Comment>,
    ) { }

    async findAll(): Promise<Comment[]> {
        return this.repository.find();
    }
}
