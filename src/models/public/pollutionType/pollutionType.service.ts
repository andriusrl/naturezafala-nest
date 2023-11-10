import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PollutionType } from './entities/pollutionType.entity';

@Injectable()
export class PollutionTypeService {
    constructor(
        @InjectRepository(PollutionType)
        private readonly repository: Repository<PollutionType>,
    ) { }

    async findAll(): Promise<PollutionType[]> {
        return this.repository.find();
    }
}
