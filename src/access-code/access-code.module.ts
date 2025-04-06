import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCodeController } from './access-code.controller';
import { AccessCodeService } from './access-code.service';
import { AccessCode } from './entities/access-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessCode])],
  controllers: [AccessCodeController],
  providers: [AccessCodeService],
  exports: [AccessCodeService],
})
export class AccessCodeModule {}
