import { Body, Controller, Post } from '@nestjs/common';
import { AccessDoorService } from './access-door.service';
import { ValidateAccessDto } from './dto/validate-access.dto';

@Controller('access_door')
export class AccessDoorController {
  constructor(private readonly accessDoorService: AccessDoorService) {}

  @Post('validate')
  async validateAccess(@Body() validateAccessDto: ValidateAccessDto) {
    return this.accessDoorService.validateAccess(validateAccessDto);
  }
}
