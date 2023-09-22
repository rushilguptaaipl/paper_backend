import { Test, TestingModule } from '@nestjs/testing';
import { DatesheetController } from './datesheet.controller';

describe('DatesheetController', () => {
  let controller: DatesheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatesheetController],
    }).compile();

    controller = module.get<DatesheetController>(DatesheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
