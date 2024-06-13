import { Injectable } from '@nestjs/common';
import { CreateExploreInput } from './dto/create-explore.input';
import { UpdateExploreInput } from './dto/update-explore.input';

@Injectable()
export class ExploreService {
  create(createExploreInput: CreateExploreInput) {
    return 'This action adds a new explore';
  }

  findAll() {
    return `This action returns all explore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} explore`;
  }

  update(id: number, updateExploreInput: UpdateExploreInput) {
    return `This action updates a #${id} explore`;
  }

  remove(id: number) {
    return `This action removes a #${id} explore`;
  }
}
