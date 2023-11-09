import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from './image.controller';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';
import { PointModule } from '../point/point.module';
import { UploadService } from 'src/common/s3/upload.service';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [TypeOrmModule.forFeature([Image]), PointModule, TokenModule],
    controllers: [ImageController],
    providers: [ImageService, UploadService],
})
export class ImageModule { }
