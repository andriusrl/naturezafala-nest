import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './dto/createPoint.dto';
import { UpdatePointDto } from './dto/updatePoint.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly repository: Repository<Point>,
    @Inject(TokenService)
    private readonly TokenService: TokenService,
  ) {}

  async findAll(): Promise<Point[]> {
    return this.repository.find();
  }

  async findOne(id): Promise<Point> {
    return this.repository.findOne({ where: { id } });
  }

  async createPoint(
    point: CreatePointDto,
    authorization: string,
  ): Promise<Point> {
    const objToken = await this.TokenService.findOne(authorization);

    const newPoint = new Point();

    newPoint.name = point.name;
    newPoint.description = point.description;
    newPoint.date = new Date();
    newPoint.latitude = point.latitude;
    newPoint.longitude = point.longitude;
    newPoint.pollution_type = point.pollution_type;
    newPoint.user = objToken.user.id;

    return this.repository.save(newPoint);
  }

  async update(updatePointDto: UpdatePointDto, authorization: string) {
    const objToken = this.TokenService.findOne(authorization);

    const point = this.repository.findOne({ where: { id: updatePointDto.id } });

    const objPromise = await Promise.all([objToken, point]);

    if (objPromise[0].user.id !== objPromise[1].user) {
      if (objPromise[0].user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
    }

    if (!point) {
      throw new NotFoundException(`Point ID ${updatePointDto.id} not found`);
    }

    await this.repository.update({ id: updatePointDto.id }, updatePointDto);

    return updatePointDto;
  }

  async delete(id: number, authorization: string) {
    const objToken = this.TokenService.findOne(authorization);

    const point = await this.repository.findOne({ where: { id } });

    const objPromise = await Promise.all([objToken, point]);

    if (objPromise[0].user.id !== objPromise[1].user) {
      if (objPromise[0].user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
    }

    if (!point) {
      throw new NotFoundException(`Point ID ${id} not found`);
    }

    return this.repository.remove(point);
  }
}
