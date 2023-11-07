import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TokenService } from '../token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import AccessEntity from './entities/access.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly repository: Repository<AccessEntity>,
    @Inject(forwardRef(() => TokenService))
    private tokenService: TokenService,
  ) { }
  async create(
    action: number,
    description: string,
    token: string,
    ip?: string,
  ) {
    const objToken = await this.tokenService.findOne(token);

    let ipConverted = ip;
    if (ip?.substr(0, 7) == '::ffff:') {
      ipConverted = ip.substr(7);
    }

    const access = new AccessEntity();

    access.user_id = objToken?.user
    access.action = action
    access.description = description
    access.ip = ipConverted

    return this.repository.save(access)
  }
}
