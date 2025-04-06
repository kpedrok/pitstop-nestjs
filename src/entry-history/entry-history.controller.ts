import { Body, Controller, Get, Post } from '@nestjs/common';
import { EntryHistoryService } from './entry-history.service';

@Controller('entry_history')
export class EntryHistoryController {
  constructor(private readonly entryHistoryService: EntryHistoryService) {}

  @Post()
  create(@Body() id: number) {
    return this.entryHistoryService.create(id);
  }

  @Get()
  findAll() {
    return this.entryHistoryService.findAll();
  }
}
