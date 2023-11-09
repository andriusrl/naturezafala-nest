import {
    Body,
    Headers,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointVote } from './entities/pointVote.entity';
import { PointVoteService } from './pointVote.service';

@Controller('pointvote')
export class PointVoteController {
    @Inject(PointVoteService)
    private readonly service: PointVoteService;

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(): Promise<PointVote[]> {
        return this.service.findAll();
    }

    @Get('/point/:id')
    async findCommentsByPoint(@Param('id') id: string): Promise<PointVote[]> {
        return this.service.findAllByPoint(+id);
    }
}
