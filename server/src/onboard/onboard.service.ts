import { Injectable } from '@nestjs/common';
import { CreateOnboardDto } from './dto/create-onboard.dto';
import { UpdateOnboardDto } from './dto/update-onboard.dto';

@Injectable()
export class OnboardService {
  create(createOnboardDto: CreateOnboardDto) {
    return 'This action adds a new onboard';
  }

  findAll() {
    return `This action returns all onboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} onboard`;
  }

  update(id: number, updateOnboardDto: UpdateOnboardDto) {
    return `This action updates a #${id} onboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} onboard`;
  }
}
