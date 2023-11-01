import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateCommentDto } from './createComment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty()
  @IsNumber()
  id: number;
}
