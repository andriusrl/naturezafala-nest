import { IsDateString, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    // @MaxLength(255)
    comment: string;

    @IsDateString()
    date: Date;

    @IsNumber()
    user: number;
    
    @IsNumber()
    point: number;
}