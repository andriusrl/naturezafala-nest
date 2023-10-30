import {
    Body,
    Headers,
    Controller,
    HttpCode,
    Post,
    Req,
    UseGuards,
    Ip,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    @HttpCode(200)
    async login(@Ip() ip, @Body() loginUserDto: LoginUserDto) {
        const response = await this.authService.login(loginUserDto);
        return response;
    }
}
