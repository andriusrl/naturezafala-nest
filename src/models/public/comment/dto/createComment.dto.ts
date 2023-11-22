import { IsDateString, IsNumber, IsString, MaxLength } from 'class-validator';
import { Point } from '../../point/entities/point.entity';

export class CreateCommentDto {
  @IsString()
  comment: string;

  @IsNumber()
  point: Point;
}
