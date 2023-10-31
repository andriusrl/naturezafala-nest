import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './dto/createPoint.dto';
import { UpdatePointDto } from './dto/updatePoint.dto';

@Injectable()
export class PointService {
    constructor(
        @InjectRepository(Point)
        private readonly repository: Repository<Point>,
    ) { }

    async findAll(): Promise<Point[]> {
        return this.repository.find();
    }

    async createPoint(point: CreatePointDto): Promise<Point> {

        const newPoint = new Point();

        newPoint.name = point.name;
        newPoint.description = point.description;
        newPoint.date = point.date;
        newPoint.latitude = point.latitude;
        newPoint.longitude = point.longitude;
        newPoint.user = point.user;

        return this.repository.save(newPoint)
    }

    async update(updatePointDto: UpdatePointDto) {

        const point = await this.repository.findOne({ where: { id: updatePointDto.id } });

        if (!point) {
            throw new NotFoundException(`Point ID ${updatePointDto.id} not found`);
        }

        await this.repository.update({ id: updatePointDto.id }, updatePointDto)

        return updatePointDto;
    }

    async delete(id: number) {
        const point = await this.repository.findOne({ where: { id } });

        if (!point) {
            throw new NotFoundException(`Point ID ${id} not found`);
        }

        return this.repository.remove(point);
    }
}
