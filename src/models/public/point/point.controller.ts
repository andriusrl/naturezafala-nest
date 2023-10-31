import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    UseGuards,
    Delete
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointService } from './point.service';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './dto/createPoint.dto';

@Controller('point')
export class PointController {
    @Inject(PointService)
    private readonly service: PointService;

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(): Promise<Point[]> {
        return this.service.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    createPoint(
        @Body() point: CreatePointDto,
    ) {
        return this.service.createPoint(point);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteFile(
        @Param('id') id,
    ) {
        return this.service.delete(+id);
    }

}
