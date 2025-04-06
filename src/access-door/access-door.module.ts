import { Module } from '@nestjs/common';
import { AccessCodeModule } from 'src/access-code/access-code.module';
import { EntryHistoryModule } from 'src/entry-history/entry-history.module';
import { AccessDoorController } from './access-door.controller';
import { AccessDoorService } from './access-door.service';

@Module({
  imports: [EntryHistoryModule, AccessCodeModule],
  controllers: [AccessDoorController],
  providers: [AccessDoorService],
  exports: [AccessDoorService],
})
export class AccessDoorModule {}
