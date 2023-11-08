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
    Ip
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';

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

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async create(
        @Headers('authorization') authorization: string,
        @Ip() ip,
        @Body() comment: CreateCommentDto,
    ) {
        const response = this.service.create(comment, authorization);

        await this.accessService.create(AccessHelper.ACTION.ADDED, 'comment', authorization, ip);

        return response;
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('')
    update(
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
