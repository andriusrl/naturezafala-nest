import { IsBoolean } from 'class-validator';

export class CreatePointVoteDto {
    @IsBoolean()
    vote: boolean;
}