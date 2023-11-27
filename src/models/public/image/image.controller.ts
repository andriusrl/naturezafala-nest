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
  ): Promise<Pagination<Image>> {
    return this.service.findAll(query, authorization);
  }

  @Get('/point/:id')
  async findCommentsByPoint(@Param('id') id: string): Promise<Image[]> {
    return this.service.findAllByPoint(+id);
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
