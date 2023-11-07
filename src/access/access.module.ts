import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccessEntity from './entities/access.entity';
import { AccessService } from './access.service';
import { TokenModule } from 'src/token/token.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AccessEntity]),
        forwardRef(() => TokenModule),
    ],
    providers: [AccessService],
    exports: [AccessService],
})
export class AccessModule { }
