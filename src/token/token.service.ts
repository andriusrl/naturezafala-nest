import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { TokenEntity } from './token.entity';
import { UserService } from 'src/models/public/user/user.service';
import { User } from 'src/models/public/user/entities/user.entity';
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async save(hash: string, username: string) {
    const id = uuidv4();
    let objToken;
    try {
      const usernameResponse = await this.userService.findOneByEmail(username);

      objToken = await this.tokenRepository.findOne({
        where: {
          user: Equal(usernameResponse.id),
        },
      });

      if (objToken) {
        await this.tokenRepository.update(
          { id: objToken.id },
          {
            hash: hash,
          },
        );
      } else {
        const newToken = new TokenEntity();
        const newUser = new User();
        newUser.id = usernameResponse.id;

        newToken.id = id;
        newToken.hash = hash;
        newToken.user = newUser;

        return this.tokenRepository.save(newToken);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async findOne(token) {
    console.log('token -----------------------!');
    console.log(token);
    return await this.tokenRepository.findOne({
      relations: { user: true },
      where: {
        hash: token.includes('Bearer') ? token.replace('Bearer ', '') : token,
      },
    });
  }
}
