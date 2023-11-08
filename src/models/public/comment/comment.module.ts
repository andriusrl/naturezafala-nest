import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TokenModule } from 'src/token/token.module';
import { AccessModule } from 'src/access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([Comment]), AccessModule, TokenModule],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule { }
