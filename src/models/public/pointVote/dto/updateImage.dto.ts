import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateImageDto } from './createImage.dto';

export class UpdateCommentDto extends PartialType(CreateImageDto) {
  @ApiProperty()
  @IsNumber()
  id: number;
}
