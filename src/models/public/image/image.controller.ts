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
  Query,
  Ip,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/createImage.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginatedDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { UpdateImageDto } from './dto/updateImage.dto';

@Controller('image')
export class ImageController {
  constructor(
    @Inject(ImageService)
    private readonly service: ImageService,
    private readonly accessService: AccessService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async index(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Query() status: { status: string },
  ): Promise<Pagination<Image>> {
    console.log('status');
    console.log(status.status);
    if (status.status)
      return this.service.findAll(
        query,
        authorization,
        status.status === 'ativo' ? true : false,
      );
    return this.service.findAll(query, authorization);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Image> {
    return this.service.findOne(+id);
  }

  @Get('/point/:id')
  async findImagesByPoint(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ): Promise<Image[]> {
    return this.service.findAllByPoint(+id, authorization);
  }

  @Post('/search')
  async search(
    @Headers('authorization') authorization: string,
    @Query() query: PaginatedDto,
    @Ip() ip,
    @Body() search: { text: string },
  ): Promise<Pagination<Image>> {
    const response = await this.service.search(
      search.text,
      query,
      authorization,
    );

    await this.accessService.create(
      AccessHelper.ACTION.VIEWED,
      'user',
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:idPoint')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Headers('authorization') authorization: string,
    @Param('idPoint') idPoint,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.create(file, idPoint, authorization);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/')
  async updatePoint(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Body() point: UpdateImageDto,
  ) {
    const response = await this.service.update(point, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.UPDATE,
      'point',
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  delete(@Headers('authorization') authorization: string, @Param('id') id) {
    return this.service.delete(+id, authorization);
  }
}
