import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from './entities/point.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private readonly repository: Repository<Point>,
  ) {}

  async findAll(): Promise<Point[]> {
    return this.repository.find();
  }
}
