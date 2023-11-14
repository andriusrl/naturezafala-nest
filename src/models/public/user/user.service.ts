import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        @Inject(TokenService)
        private readonly TokenService: TokenService,
    ) { }

    async findAll(authorization: string): Promise<User[]> {
            // const objToken = await this.TokenService.findOne(authorization);

            // console.log('objToken de teste:', objToken);

            // if (!objToken || objToken.user.type !== 1) {
            //     throw new NotFoundException();
            // }
            
            return this.repository.find();
    }

    async findOne(user: User): Promise<User> {

        if (user?.id) {
            const response = this.repository.findOne({
                where: {
                    id: user?.id,
                },
            });

            return response;
        }
        const response = this.repository.findOne({
            where: {
                email: user.email,
            },
        });

        return response;

    }

    async findOneByEmail(email: string): Promise<User> {
        const response = this.repository.findOne({
            where: {
                email
            },
        });

        return response;
    }

    async create(userBody: CreateUserDto): Promise<User> {
        const user = new User();

        user.name = userBody.name
        user.birth_date = userBody.birthDate
        user.fone = userBody.fone
        user.cpf = userBody.cpf
        user.email = userBody.email
        user.password = userBody.password

        return this.repository.save(user)
    }
}
