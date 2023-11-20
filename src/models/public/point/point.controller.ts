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

    @Get('/')
    async findAll(): Promise<Point[]> {
        return this.service.findAll();
    }

    @Get('/:id')
    async findOne(
        @Headers('authorization') authorization: string,
        @Ip() ip,
        @Param('id') id,
    ) {
        const response = await this.service.findOne(+id);

        await this.accessService.create(AccessHelper.ACTION.VIEWED, 'point', authorization, ip);

        return response
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    async createPoint(
        @Headers('authorization') authorization: string,
        @Ip() ip,
        @Body() point: CreatePointDto,
    ) {

        const response = this.service.createPoint(point, authorization);

        await this.accessService.create(AccessHelper.ACTION.ADDED, 'point', authorization, ip);

        return response
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('')
    async updatePoint(
        @Headers('authorization') authorization: string,
        @Ip() ip,
        @Body() point: UpdatePointDto,
    ) {
        const response = await this.service.update(point, authorization);

        await this.accessService.create(AccessHelper.ACTION.UPDATE, 'point', authorization, ip);

        return response
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    async deleteFile(
        @Headers('authorization') authorization: string,
        @Ip() ip,
        @Param('id') id,
    ) {
        const response = await this.service.delete(+id, authorization);

        await this.accessService.create(AccessHelper.ACTION.DELETE, 'point', authorization, ip);

        return response
    }

}
