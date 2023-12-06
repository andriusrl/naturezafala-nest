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
      `buscou por: ${search?.text}`,
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:idPoint')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Param('idPoint') idPoint,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = await this.service.create(file, idPoint, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.ADDED,
      `imagem ao ponto: ${idPoint}`,
      authorization,
      ip,
    );

    return response;
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
      `Atualizou imagem do ponto: ${point?.id}`,
      authorization,
      ip,
    );

    return response;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async delete(
    @Headers('authorization') authorization: string,
    @Ip() ip,
    @Param('id') id,
  ) {
    const response = await this.service.delete(+id, authorization);

    await this.accessService.create(
      AccessHelper.ACTION.UPDATE,
      `Deletou imagem: ${id}`,
      authorization,
      ip,
    );

    return response;
  }
}
