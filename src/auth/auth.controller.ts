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
import { AccessService } from 'src/access/access.service';
import { AccessHelper } from 'src/helpers/access.helper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accessService: AccessService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Ip() ip, @Body() loginUserDto: LoginUserDto) {
    const response = await this.authService.login(loginUserDto);

    await this.accessService.create(
      AccessHelper.ACTION.LOGGED,
      'Login',
      response.token,
      ip,
    );

    return response;
  }
}
