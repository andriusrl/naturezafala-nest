import {
    Controller,
    Get,
    Inject,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Controller('comment')
export class CommentController {
    @Inject(CommentService)
    private readonly service: CommentService;

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(): Promise<Comment[]> {
        return this.service.findAll();
    }
}
