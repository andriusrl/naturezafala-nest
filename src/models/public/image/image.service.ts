import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';
import { UploadService } from 'src/common/s3/upload.service';
import { PointService } from '../point/point.service';
import { TokenService } from 'src/token/token.service';
import { Point } from '../point/entities/point.entity';
import { Pagination, paginateRaw } from 'nestjs-typeorm-paginate';
import { UpdateImageDto } from './dto/updateImage.dto';

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
  ) { }

  async findAll(
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
    status?: boolean,
  ): Promise<Pagination<Image>> {
    const objToken = await this.tokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    const skip = (options.page - 1) * options.limit;

    if (status !== undefined) {

      console.log('ATIVO')
      console.log(status)
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
        where: { status: Equal(status) },
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

  async findAllByPoint(id: number, authorization?): Promise<Image[]> {
    const objToken = await this.tokenService.findOne(authorization);

    const objPoint = await this.pointService.findOne(id, authorization);

    if (objToken !== null && objToken?.user.id === objPoint?.user) {
      return this.repository.find({
        relations: { point: true },
        where: {
          point: Equal(id),
        },
      });
    }

    return this.repository.find({
      relations: { point: true },
      where: {
        point: Equal(id),
        status: Equal(true),
      },
    });
  }

  async findOne(id: number): Promise<Image> {
    return this.repository.findOne({
      where: {
        id: Equal(id),
      },
    });
  }

  async update(updateImageDto: UpdateImageDto, authorization: string) {
    const objToken = await this.tokenService.findOne(authorization);

    if (objToken.user.type !== 1) {
      throw new NotFoundException(`Not authorized`);
    }

    if (!updateImageDto?.id) {
      throw new NotFoundException(`Image ID ${updateImageDto.id} not found`);
    }

    await this.repository.update(
      { id: updateImageDto.id },
      { ...updateImageDto, status: updateImageDto.status },
    );

    return { ...updateImageDto, status: updateImageDto.status };
  }

  async search(
    search: string,
    options: { page?: number; limit?: number } = { page: 1, limit: 12 },
    authorization: string,
  ): Promise<Pagination<Image>> {
    try {
      const objToken = await this.tokenService.findOne(authorization);

      if (objToken.user.type !== 1) {
        throw new NotFoundException(`Not authorized`);
      }

      // const skip = (options.page - 1) * options.limit;
      // const [response, total] = await this.repository.findAndCount({
      //   relations: { point: { pollutionType: true } },
      //   select: {
      //     id: true,
      //     url: true,
      //     status: true,
      //     point: {
      //       pollutionType: {
      //         name: true,
      //       },
      //     },
      //   },
      //   take: options.limit,
      //   skip: skip,
      //   where: { point: { name: ILike(`%${search}%`) } },
      // });

      // const totalPages = Math.ceil(total / options.limit);

      // return {
      //   items: response,
      //   meta: {
      //     totalItems: total,
      //     totalPages: totalPages,
      //     itemsPerPage: Number(options.limit),
      //     currentPage: Number(options.page),
      //     itemCount: response.length,
      //   },
      // };

      // Não funcionou, procurar porque depois

      const queryBuilder = this.repository
        .createQueryBuilder('i')
        .select([
          'i.id as id',
          'i.url as url',
          'i.point as point',
          'point.name as pointName',
          'pollutionType.name as pollutionTypeName',
        ])
        .leftJoin('i.point', 'point')
        .leftJoin('point.pollutionType', 'pollutionType')
        .orderBy('i.id', 'DESC');

      if (search) {
        queryBuilder.andWhere('lower(point.name) ~ :search', {
          search: search.toLowerCase(),
        });
      }

      return paginateRaw(queryBuilder, { limit: 12, page: 1 });
    } catch (err) {
      console.log(err);
    }
  }

  async create(
    image: Express.Multer.File,
    idPoint: Point,
    authorization: string,
  ) {
    // ): Promise<Image> {
    const objToken = this.tokenService.findOne(authorization);

    const point = this.pointService.findOne(idPoint, authorization);

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
