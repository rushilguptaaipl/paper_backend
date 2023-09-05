import { Test, TestingModule } from '@nestjs/testing';
import { LibsResolver } from './libs.resolver';
import { LibsService } from './libs.service';

describe('LibsResolver', () => {
  let resolver: LibsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibsResolver, LibsService],
    }).compile();

    resolver = module.get<LibsResolver>(LibsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
