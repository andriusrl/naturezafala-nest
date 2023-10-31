import {
    Controller,
    Get,
    Inject,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointService } from './point.service';
import { Point } from './entities/point.entity';

@Controller('point')
@UseGuards(AuthGuard('jwt'))
export class PointController {
    @Inject(PointService)
    private readonly service: PointService;

    @Get('/')
    async index(): Promise<Point[]> {
        return this.service.findAll();
    }
}
