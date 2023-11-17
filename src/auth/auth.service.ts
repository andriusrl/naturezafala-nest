import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/public/user/entities/user.entity';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async login(user, refresh?) {
    const payload = {
      sub: user?.username,
      username: user?.username,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
    });

    this.tokenService.save(token, user.username);

    if (refresh) {
      return {
        token,
      };
    }

    const objToken = await this.tokenService.findOne(token);

    console.log('oque quero q retorne')
    console.log(objToken)

    return {
      username: objToken.user.email,
      token,
      name: objToken.user.name,
    };
  }

  async validate(user) {
    const resDados = await this.userRepository.findOne({
      where: {
        email: user.username,
        password: user.password,
      },
    });

    if (!resDados)
      throw new UnauthorizedException('Email ou senha invalidos');
    return resDados;
  }
}
