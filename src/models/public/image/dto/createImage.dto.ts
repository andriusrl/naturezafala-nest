import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateImageDto {
    @IsString()
    @MaxLength(255)
    url: string;

    @IsNumber()
    point: number;
}