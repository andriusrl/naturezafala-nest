import { IsDateString, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreatePointDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    description: string;

    @IsDateString()
    date: Date;

    @IsNumber()
    user: number;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}