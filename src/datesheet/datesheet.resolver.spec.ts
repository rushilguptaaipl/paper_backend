import { Test, TestingModule } from '@nestjs/testing';
import { DatesheetResolver } from './datesheet.resolver';

describe('DatesheetResolver', () => {
  let resolver: DatesheetResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatesheetResolver],
    }).compile();

    resolver = module.get<DatesheetResolver>(DatesheetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
