import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntryHistory } from './entities/entry-history.entity';
@Injectable()
export class EntryHistoryService {
  constructor(
    @InjectRepository(EntryHistory)
    private readonly entryHistoryRepository: Repository<EntryHistory>,
  ) {}

  create(id: number) {
    const entryHistory = this.entryHistoryRepository.create({
      id,
      enteredAt: new Date(),
    });
    return this.entryHistoryRepository.save(entryHistory);
  }

  findAll() {
    return this.entryHistoryRepository.find();
  }
}
