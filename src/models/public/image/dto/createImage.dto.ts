import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Point } from '../../point/entities/point.entity';

export class CreateImageDto {
  @IsString()
  @MaxLength(255)
  url: string;

  @IsNumber()
  point: Point;
}
