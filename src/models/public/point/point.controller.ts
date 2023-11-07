import {
    Headers,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    UseGuards,
    Delete,
    Patch,
    Ip
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PointService } from './point.service';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './dto/createPoint.dto';
import { UpdatePointDto } from './dto/updatePoint.dto';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';

@Controller('point')
export class PointController {
    constructor(
        @Inject(PointService)
        private readonly service: PointService,
        private readonly accessService: AccessService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(): Promise<Point[]> {
        return this.service.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async createPoint(
        @Headers('authorization') authorization: string,
        @Ip() ip,
        @Body() point: CreatePointDto,
    ) {

        const response = this.service.createPoint(point);

        await this.accessService.create(AccessHelper.ACTION.ADDED, 'point', authorization, ip);

        return response
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('')
    updatePoint(
        @Body() point: UpdatePointDto,
    ) {
        return this.service.update(point);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    deleteFile(
        @Param('id') id,
    ) {
        return this.service.delete(+id);
    }

}
