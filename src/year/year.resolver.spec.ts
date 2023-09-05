import { Test, TestingModule } from '@nestjs/testing';
import { YearResolver } from './year.resolver';

describe('YearResolver', () => {
  let resolver: YearResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YearResolver],
    }).compile();

    resolver = module.get<YearResolver>(YearResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
