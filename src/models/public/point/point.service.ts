import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, ILike, Repository } from 'typeorm';
import { Point } from './entities/point.entity';
import { CreatePointDto } from './dto/createPoint.dto';
import { UpdatePointDto } from './dto/updatePoint.dto';
import { TokenService } from 'src/token/token.service';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly repository: Repository<Point>,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async findAll(
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<Point>> {
    const objToken = await this.tokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    const skip = (options.page - 1) * options.limit;
    const [response, total] = await this.repository.findAndCount({
      take: options.limit,
      skip: skip,
    });

    const totalPages = Math.ceil(total / options.limit);

    return {
      items: response,
      meta: {
        totalItems: total,
        totalPages: totalPages,
        itemsPerPage: Number(options.limit),
        currentPage: Number(options.page),
        itemCount: response.length,
      },
    };
  }

  async findAllKm(lat: number, long: number, km: number): Promise<Point[]> {
    // calculating the distance from the point using the Haversine formula

    const differenceLat = (km / 6371) * (180 / Math.PI);

    const differenceLon =
      ((km / 6371) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);

    return await this.repository.find({
      where: {
        latitude: Between(lat - differenceLat, lat + differenceLat),
        longitude: Between(long - differenceLon, long + differenceLon),
        status: Equal(true),
      },
    });
  }

  async findOne(id): Promise<Point> {
    return this.repository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        date: true,
        latitude: true,
        longitude: true,
        pollutionType: { id: true, name: true },
      },
      relations: { pollutionType: true },
      where: { id },
    });
  }

  async search(
    search: string,
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<Point>> {
    try {
      const objToken = await this.tokenService.findOne(authorization);

      if (objToken.user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }

      const skip = (options.page - 1) * options.limit;
      const [response, total] = await this.repository.findAndCount({
        take: options.limit,
        skip: skip,
        where: {
          name: ILike(`%${search}%`),
        },
      });

      const totalPages = Math.ceil(total / options.limit);

      return {
        items: response,
        meta: {
          totalItems: total,
          totalPages: totalPages,
          itemsPerPage: Number(options.limit),
          currentPage: Number(options.page),
          itemCount: response.length,
        },
      };
    } catch (err) {
      console.log(err);
    }
  }

  async createPoint(
    point: CreatePointDto,
    authorization: string,
  ): Promise<Point> {
    const objToken = await this.tokenService.findOne(authorization);

    const newPoint = new Point();

    newPoint.name = point.name;
    newPoint.description = point.description;
    newPoint.date = new Date();
    newPoint.latitude = point.latitude;
    newPoint.longitude = point.longitude;
    newPoint.pollutionType = point.pollutionType;
    newPoint.user = objToken.user.id;

    return this.repository.save(newPoint);
  }

  async update(
    updatePointDto: UpdatePointDto,
    status: boolean,
    authorization: string,
  ) {
    const objToken = this.tokenService.findOne(authorization);

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

    if (objPromise[0].user.type === 1) {
      await this.repository.update(
        { id: updatePointDto.id },
        { ...updatePointDto, status },
      );

      return { ...updatePointDto, status };
    }

    await this.repository.update(
      { id: updatePointDto.id },
      { name: updatePointDto.name, description: updatePointDto.description },
    );

    return {
      id: updatePointDto.id,
      ...{ name: updatePointDto.name, description: updatePointDto.description },
    };
  }

  async delete(id: number, authorization: string) {
    const objToken = this.tokenService.findOne(authorization);

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
