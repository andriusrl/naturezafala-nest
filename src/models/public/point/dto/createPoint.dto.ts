import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PollutionType } from '../../pollutionType/entities/pollutionType.entity';

export class CreatePointDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  pollutionType: PollutionType;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @IsOptional()
  status?: boolean;
}
