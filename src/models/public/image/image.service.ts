import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image)
        private readonly repository: Repository<Image>,
    ) { }

    async findAll(): Promise<Image[]> {
        return this.repository.find();
    }

    async create(image: CreateImageDto): Promise<Image> {

        const newImage = new Image();

        newImage.url = image.url;
        newImage.point = image.point;

        return this.repository.save(newImage)
    }

    async delete(id: number) {
        const image = await this.repository.findOne({ where: { id } });

        if (!image) {
            throw new NotFoundException(`Image ID ${id} not found`);
        }

        return this.repository.remove(image);
    }
}
