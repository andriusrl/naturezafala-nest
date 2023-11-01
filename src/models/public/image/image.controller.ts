import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';

@Controller('image')
export class ImageController {
    @Inject(ImageService)
    private readonly service: ImageService;

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(): Promise<Image[]> {
        return this.service.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('')
    create(
        @Body() image: CreateImageDto,
    ) {
        return this.service.create(image);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    delete(
        @Param('id') id,
    ) {
        return this.service.delete(+id);
    }
}
