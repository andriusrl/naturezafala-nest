import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) { }

    async findOne(user: User): Promise<User> {

        if (user?.id) {
            const response = this.repository.findOne({
                where: {
                    id: user?.id,
                },
            });

            return response;
        } else {
            const response = this.repository.findOne({
                where: {
                    email: user.email,
                },
            });

            return response;
        }
    }
}
