import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';
import { UploadService } from 'src/common/s3/upload.service';
import { PointService } from '../point/point.service';
import { TokenService } from 'src/token/token.service';
import { Point } from '../point/entities/point.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly repository: Repository<Image>,
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(UploadService)
    private readonly uploadService: UploadService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async findAll(
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<Image>> {
    const objToken = await this.tokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    const skip = (options.page - 1) * options.limit;
    const [response, total] = await this.repository.findAndCount({
      relations: { point: { pollutionType: true } },
      select: {
        id: true,
        url: true,
        status: true,
        point: {
          name: true,
          pollutionType: {
            name: true,
          },
        },
      },
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

  async findAllByPoint(id: number): Promise<Image[]> {
    return this.repository.find({
      relations: { point: true },
      where: {
        point: Equal(id),
        status: Equal(true),
      },
    });
  }

  async create(
    image: Express.Multer.File,
    idPoint: Point,
    authorization: string,
  ): Promise<Image> {
    const objToken = this.tokenService.findOne(authorization);

    const point = this.pointService.findOne(idPoint);

    const objPromise = await Promise.all([objToken, point]);

    if (!objPromise[1]) {
      throw new NotFoundException(`Point ID ${idPoint} not found`);
    }

    if (objPromise[0]?.user.id !== objPromise[1]?.user) {
      if (objPromise[0].user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
    }

    const imageResponse = await this.uploadService.execute(image, 'point/');

    const newImage = new Image();

    newImage.url = imageResponse.Location;
    newImage.point = idPoint;

    return this.repository.save(newImage);
  }

  async delete(id: number, authorization: string): Promise<Image> {
    const objToken = this.tokenService.findOne(authorization);

    const point = this.pointService.findOne(id);

    const objPromise = await Promise.all([objToken, point]);

    if (objPromise[0]?.user.id !== objPromise[1]?.user) {
      if (objPromise[0].user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }
    }
    const image = await this.repository.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException(`Image ID ${id} not found`);
    }

    return this.repository.remove(image);
  }
}
