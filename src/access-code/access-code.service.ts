import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccessCodeDto } from './dto/create-access-code.dto';
import { AccessCode } from './entities/access-code.entity';

@Injectable()
export class AccessCodeService {
  constructor(
    @InjectRepository(AccessCode)
    private readonly accessCodeRepository: Repository<AccessCode>,
  ) {}

  async create(createAccessCodeDto: CreateAccessCodeDto) {
    createAccessCodeDto.code = createAccessCodeDto.code.toLowerCase();
    const accessCode = this.accessCodeRepository.create(createAccessCodeDto);
    return this.accessCodeRepository.save(accessCode);
  }

  async findAll() {
    return this.accessCodeRepository.find();
  }

  async findByCode(code: string): Promise<AccessCode | null> {
    return await this.accessCodeRepository.findOne({
      where: { code: code.toLowerCase() },
    });
  }
}
