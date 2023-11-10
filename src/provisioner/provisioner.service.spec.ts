import { Test, TestingModule } from '@nestjs/testing';
import { ProvisionerService } from './provisioner.service';

describe('ProvisionerService', () => {
  let service: ProvisionerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvisionerService],
    }).compile();

    service = module.get<ProvisionerService>(ProvisionerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
