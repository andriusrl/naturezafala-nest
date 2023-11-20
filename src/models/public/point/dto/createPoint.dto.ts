import { IsDateString, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreatePointDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    pollution_type: number;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}