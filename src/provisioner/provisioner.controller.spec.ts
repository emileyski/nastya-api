import { Test, TestingModule } from '@nestjs/testing';
import { ProvisionerController } from './provisioner.controller';
import { ProvisionerService } from './provisioner.service';

describe('ProvisionerController', () => {
  let controller: ProvisionerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvisionerController],
      providers: [ProvisionerService],
    }).compile();

    controller = module.get<ProvisionerController>(ProvisionerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
