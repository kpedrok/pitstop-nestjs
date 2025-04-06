import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessCodeService } from 'src/access-code/access-code.service';
import { EntryHistoryService } from 'src/entry-history/entry-history.service';
import { AccessDoorService } from './access-door.service';
import { ValidateAccessDto } from './dto/validate-access.dto';

describe('AccessDoorService', () => {
  let service: AccessDoorService;
  let accessCodeService: jest.Mocked<AccessCodeService>;
  let entryHistoryService: jest.Mocked<EntryHistoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessDoorService,
        {
          provide: EntryHistoryService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AccessCodeService,
          useValue: {
            findByCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccessDoorService>(AccessDoorService);
    accessCodeService = module.get(AccessCodeService);
    entryHistoryService = module.get(EntryHistoryService);
  });

  describe('validateAccess', () => {
    it('should throw an error if ID is missing', async () => {
      const dto: ValidateAccessDto = {
        id: null,
        code: '',
        name: '',
      } as any as ValidateAccessDto;
      await expect(service.validateAccess(dto)).rejects.toThrow(
        new BadRequestException('ID is required'),
      );
    });

    it('should throw an error if neither code nor name is provided', async () => {
      const dto: ValidateAccessDto = { id: 1, code: '', name: '' };
      await expect(service.validateAccess(dto)).rejects.toThrow(
        new BadRequestException('Either code or name is required'),
      );
    });

    it('should grant access if name matches allowedName', async () => {
      const dto: ValidateAccessDto = { id: 1, code: '', name: 'Joe' };
      await service.validateAccess(dto);
      expect(entryHistoryService.create).toHaveBeenCalledWith(1);
    });

    it('should grant access if a valid access code is provided', async () => {
      const dto: ValidateAccessDto = { id: 1, code: 'valid-code', name: '' };
      accessCodeService.findByCode.mockResolvedValueOnce({
        id: 1,
        code: 'valid-code',
      });
      await service.validateAccess(dto);
      expect(entryHistoryService.create).toHaveBeenCalledWith(1);
    });

    it('should deny access if name and code are invalid', async () => {
      const dto: ValidateAccessDto = {
        id: 1,
        code: 'invalid-code',
        name: 'InvalidName',
      };
      accessCodeService.findByCode.mockResolvedValueOnce(null);
      await expect(service.validateAccess(dto)).rejects.toThrow(
        new BadRequestException('Access denied'),
      );
    });

    it('should deny access if name is correct but ID is missing', async () => {
      const dto: ValidateAccessDto = {
        id: null,
        code: '',
        name: 'Joe',
      } as any as ValidateAccessDto;
      await expect(service.validateAccess(dto)).rejects.toThrow(
        new BadRequestException('ID is required'),
      );
    });

    it('should deny access if code is valid but ID is missing', async () => {
      const dto: ValidateAccessDto = {
        id: null,
        code: 'valid-code',
        name: '',
      } as any as ValidateAccessDto;
      accessCodeService.findByCode.mockResolvedValueOnce({
        id: 1,
        code: 'valid-code',
      });
      await expect(service.validateAccess(dto)).rejects.toThrow(
        new BadRequestException('ID is required'),
      );
    });

    it('should log and throw an error if entryHistoryService throws an error', async () => {
      const dto: ValidateAccessDto = { id: 1, code: '', name: 'Joe' };
      entryHistoryService.create.mockRejectedValueOnce(
        new Error('Database error'),
      );
      await expect(service.validateAccess(dto)).rejects.toThrow(
        new Error('Database error'),
      );
    });

    it('should handle case-insensitive name matching for allowedName', async () => {
      const dto: ValidateAccessDto = { id: 1, code: '', name: 'joe' };
      await service.validateAccess(dto);
      expect(entryHistoryService.create).toHaveBeenCalledWith(1);
    });

    it('should handle empty string for code gracefully', async () => {
      const dto: ValidateAccessDto = { id: 1, code: '', name: 'Joe' };
      await service.validateAccess(dto);
      expect(entryHistoryService.create).toHaveBeenCalledWith(1);
    });

    it('should handle null for code gracefully', async () => {
      const dto: ValidateAccessDto = {
        id: 1,
        code: null,
        name: 'Joe',
      } as any as ValidateAccessDto;
      await service.validateAccess(dto);
      expect(entryHistoryService.create).toHaveBeenCalledWith(1);
    });
  });
});
