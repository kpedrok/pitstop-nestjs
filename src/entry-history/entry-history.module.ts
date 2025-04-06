import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntryHistory } from './entities/entry-history.entity';
import { EntryHistoryController } from './entry-history.controller';
import { EntryHistoryService } from './entry-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntryHistory])],
  controllers: [EntryHistoryController],
  providers: [EntryHistoryService],
  exports: [EntryHistoryService],
})
export class EntryHistoryModule {}
