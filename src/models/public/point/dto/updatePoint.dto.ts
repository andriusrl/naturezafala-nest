import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreatePointDto } from './createPoint.dto';

export class UpdatePointDto extends PartialType(CreatePointDto) {
  @ApiProperty()
  @IsNumber()
  id: number;
}
