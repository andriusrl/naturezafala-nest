import {
    Headers,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    UseGuards,
    Delete,
    Patch,
    Ip
} from '@nestjs/common';
import { AccessService } from 'src/access/access.service';
import { PollutionTypeService } from './pollutionType.service';
import { PollutionType } from './entities/pollutionType.entity';

@Controller('pollutiontype')
export class PollutionTypeController {
    constructor(
        @Inject(PollutionTypeService)
        private readonly service: PollutionTypeService,
        private readonly accessService: AccessService,
    ) { }

    @Get('/')
    async findAll(): Promise<PollutionType[]> {
        return this.service.findAll();
    }
}
