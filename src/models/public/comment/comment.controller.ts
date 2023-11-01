import {
    Body,
    Controller,
    Get,
    Inject,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comment')
export class CommentController {
    @Inject(CommentService)
    private readonly service: CommentService;

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(): Promise<Comment[]> {
        return this.service.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    createPoint(
        @Body() comment: CreateCommentDto,
    ) {
        return this.service.createComment(comment);
    }
}
