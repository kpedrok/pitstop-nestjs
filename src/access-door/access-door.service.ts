import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AccessCodeService } from 'src/access-code/access-code.service';
import { AccessCode } from 'src/access-code/entities/access-code.entity';
import { EntryHistoryService } from 'src/entry-history/entry-history.service';
import { ValidateAccessDto } from './dto/validate-access.dto';

@Injectable()
export class AccessDoorService {
  private readonly allowedName: string;
  private readonly logger = new Logger(AccessDoorService.name); // Initialize logger

  constructor(
    private readonly entryHistoryService: EntryHistoryService,
    private readonly accessCodeService: AccessCodeService,
  ) {
    this.allowedName = process.env.ALLOWED_NAME || 'Joe'; // Configurable allowed name
  }

  async validateAccess(validateAccessDto: ValidateAccessDto): Promise<void> {
    const { id, code, name } = validateAccessDto;
    this.logger.log(
      `Validating access for ID: ${id}, Name: ${name}, Code: ${code ? 'Provided' : 'Not Provided'}`,
    );

    if (!id) {
      this.logger.warn('Validation failed: ID is missing');
      throw new BadRequestException('ID is required');
    }

    if (!code && !name) {
      this.logger.warn('Validation failed: Neither code nor name provided');
      throw new BadRequestException('Either code or name is required');
    }

    let hasValidAccessCode: AccessCode | null = null;
    if (code) {
      this.logger.debug(`Checking access code: ${code}`);
      hasValidAccessCode = await this.accessCodeService.findByCode(code);
      if (hasValidAccessCode) {
        this.logger.log(`Access code ${code} is valid`);
      } else {
        this.logger.warn(`Access code ${code} is invalid`);
      }
    }

    if (
      name?.toLowerCase() === this.allowedName.toLowerCase() ||
      hasValidAccessCode
    ) {
      this.logger.log(`Access granted for ID: ${id}`);
      await this.entryHistoryService.create(id);
    } else {
      this.logger.warn(
        `Access denied for ID: ${id}, Name: ${name}, Code: ${code}`,
      );
      throw new BadRequestException('Access denied');
    }
  }
}
