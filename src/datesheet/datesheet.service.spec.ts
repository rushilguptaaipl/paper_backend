import { Test, TestingModule } from '@nestjs/testing';
import { DatesheetService } from './datesheet.service';

describe('DatesheetService', () => {
  let service: DatesheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatesheetService],
    }).compile();

    service = module.get<DatesheetService>(DatesheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
