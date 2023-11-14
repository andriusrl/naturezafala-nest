import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';
import { UploadService } from 'src/common/s3/upload.service';
import { PointService } from '../point/point.service';
import { TokenService } from 'src/token/token.service';
import { Point } from '../point/entities/point.entity';

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
        private readonly TokenService: TokenService,
    ) { }

    async findAll(): Promise<Image[]> {
        return this.repository.find();
    }

    async findAllByPoint(id: number): Promise<Image[]> {
        return this.repository.find({
            relations: { point: true, },
            where: {
                point: Equal(id)
            }
        });
    }

    async create(image: Express.Multer.File, idPoint: Point, authorization: string): Promise<Image> {

        const objToken = this.TokenService.findOne(authorization);

        const point = this.pointService.findOne(idPoint);

        const objPromise = await Promise.all([objToken, point]);

        if (!objPromise[1]) {
            throw new NotFoundException(`Point ID ${idPoint} not found`);
        }

        if (objPromise[0]?.user.id !== objPromise[1]?.user) {
            throw new NotFoundException(`Not authorized`);
        }

        const imageResponse = await this.uploadService.execute(image, "point/")

        const newImage = new Image();

        newImage.url = imageResponse.Location;
        newImage.point = idPoint;

        return this.repository.save(newImage)
    }

    async delete(id: number, authorization: string): Promise<Image> {

        const objToken = this.TokenService.findOne(authorization);

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
