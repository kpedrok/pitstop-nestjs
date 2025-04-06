import { Body, Controller, Post } from '@nestjs/common';
import { AccessCodeService } from './access-code.service';
import { CreateAccessCodeDto } from './dto/create-access-code.dto';

@Controller('access_code')
export class AccessCodeController {
  constructor(private readonly accessCodeService: AccessCodeService) {}

  @Post()
  create(@Body() createAccessCodeDto: CreateAccessCodeDto) {
    return this.accessCodeService.create(createAccessCodeDto);
  }
}
