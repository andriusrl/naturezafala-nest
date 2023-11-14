import { IsDateString,IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsDateString()
    birthDate: Date;

    @IsString()
    @MaxLength(25)
    fone: string;

    @IsString()
    @MaxLength(11)
    cpf: string;

    @IsString()
    @MaxLength(255)
    email: string;

    @IsString()
    @MaxLength(30)
    password: string;
}