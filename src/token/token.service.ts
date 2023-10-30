import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { TokenEntity } from './token.entity';
import { UserService } from 'src/models/public/user/user.service';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(TokenEntity)
        private tokenRepository: Repository<TokenEntity>,
        private userService: UserService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
    ) { }

    async save(hash: string, username: string) {
        const id = uuidv4();
        let objToken;
        try {

            const usernameResponse = await this.userService.findOne({
                email: username,
            });

            objToken = await this.tokenRepository.findOne({
                where: {
                    user: usernameResponse.id,
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
                this.tokenRepository.insert({
                    id,
                    hash,
                    user: usernameResponse.id,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    async refreshToken(oldToken: string) {
        const objToken = await this.tokenRepository.findOne({
            where: {
                hash: oldToken,
            },
        });

        if (objToken) {
            const user = await this.userService.findOne({ id: objToken.user });

            return await this.authService.login(user, true);
        } else {
            return new HttpException(
                {
                    errorMessage: 'Token invalidado',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    async findOne(token) {
        if (token.includes('Bearer')) {
            return await this.tokenRepository.findOne({
                where: {
                    hash: token.replace('Bearer ', ''),
                },
            });
        }

        const queryBuilder = this.tokenRepository
            .createQueryBuilder('tk')
            .select([
                'tk.id as id',
                'tk.hash as hash',
                'user as user',
                'user.nome as user_nome',
            ])
            .where('tk.hash = :token', { token })
            .leftJoin('tk.user', 'user');

        return await queryBuilder.getRawOne();
    }
}
