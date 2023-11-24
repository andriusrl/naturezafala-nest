import {
  Body,
  Headers,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  @Inject(ImageService)
  private readonly service: ImageService;

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async index(): Promise<Image[]> {
    return this.service.findAll();
  }

  @Get('/point/:id')
  async findCommentsByPoint(@Param('id') id: string): Promise<Image[]> {
    return this.service.findAllByPoint(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:idPoint')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Headers('authorization') authorization: string,
    @Param('idPoint') idPoint,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('file');
    console.log(file);
    return this.service.create(file, idPoint, authorization);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  delete(@Headers('authorization') authorization: string, @Param('id') id) {
    return this.service.delete(+id, authorization);
  }
}
