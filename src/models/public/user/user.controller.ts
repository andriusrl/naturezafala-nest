import {
    Headers,
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
    Ip,
    NotFoundException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';
import { TokenService } from 'src/token/token.service';

@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService)
        private readonly service: UserService,
        @Inject(AccessService)
        private readonly accessService: AccessService,
        @Inject(TokenService)
        private readonly TokenService: TokenService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('/')
    async index(
        @Headers('authorization') authorization: string,
        @Ip() ip,
    ) {

        const objToken = await this.TokenService.findOne(authorization);

        console.log('objToken de teste:', objToken);

        if (!objToken || objToken.user.type !== 1) {
            throw new NotFoundException("Not authorized");
        }

        const response = this.service.findAll(authorization);

        await this.accessService.create(AccessHelper.ACTION.ADDED, 'comment', authorization, ip);

        return response;
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Post('')
    // async create(
    //     @Headers('authorization') authorization: string,
    //     @Ip() ip,
    //     @Body() comment: CreateCommentDto,
    // ) {
    //     const response = await this.service.create(comment, authorization);

    //     await this.accessService.create(AccessHelper.ACTION.ADDED, 'comment', authorization, ip);

    //     return response;
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Patch('')
    // async update(
    //     @Headers('authorization') authorization: string,
    //     @Ip() ip,
    //     @Body() comment: UpdateCommentDto,
    // ) {
    //     const response = await this.service.update(comment, authorization);

    //     await this.accessService.create(AccessHelper.ACTION.UPDATE, 'comment', authorization, ip);

    //     return response;
    // }

    // @UseGuards(AuthGuard('jwt'))
    // @Delete('/:id')
    // async deleteFile(
    //     @Headers('authorization') authorization: string,
    //     @Ip() ip,
    //     @Param('id') id,
    // ) {
    //     const response = await this.service.delete(+id, authorization);

    //     await this.accessService.create(AccessHelper.ACTION.UPDATE, 'comment', authorization, ip);

    //     return response;
    // }
}
