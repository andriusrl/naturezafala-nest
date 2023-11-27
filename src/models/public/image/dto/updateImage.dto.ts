import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateImageDto } from './createImage.dto';

export class UpdateImageDto extends PartialType(CreateImageDto) {
  @ApiProperty()
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  status?: boolean;
}
