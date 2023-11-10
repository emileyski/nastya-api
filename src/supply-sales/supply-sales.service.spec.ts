import { Test, TestingModule } from '@nestjs/testing';
import { SupplySalesService } from './supply-sales.service';

describe('SupplySalesService', () => {
  let service: SupplySalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplySalesService],
    }).compile();

    service = module.get<SupplySalesService>(SupplySalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
