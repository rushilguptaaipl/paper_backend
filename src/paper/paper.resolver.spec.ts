import { Test, TestingModule } from '@nestjs/testing';
import { PaperResolver } from './paper.resolver';

describe('PaperResolver', () => {
  let resolver: PaperResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaperResolver],
    }).compile();

    resolver = module.get<PaperResolver>(PaperResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
