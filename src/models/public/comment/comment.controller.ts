import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

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
        return this.service.create(comment);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('')
    updatePoint(
        @Body() comment: UpdateCommentDto,
    ) {
        return this.service.update(comment);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteFile(
        @Param('id') id,
    ) {
        return this.service.delete(+id);
    }
}
