import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProvisionerService } from './provisioner.service';
import { CreateProvisionerDto } from './dto/create-provisioner.dto';
import { UpdateProvisionerDto } from './dto/update-provisioner.dto';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { Public } from 'src/core/decorators/public.decorator';
import { MailService } from 'src/mail/mail.service';
import { MailToProvisionerDto } from './dto/mail-to-provisioner.dto';

@ApiTags('provisioner')
@Controller('provisioner')
export class ProvisionerController {
  constructor(private readonly provisionerService: ProvisionerService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createProvisionerDto: CreateProvisionerDto) {
    return this.provisionerService.create(createProvisionerDto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.provisionerService.findAll();
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provisionerService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProvisionerDto: UpdateProvisionerDto,
  ) {
    return this.provisionerService.update(id, updateProvisionerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provisionerService.remove(id);
  }

  @Public()
  @Post('email/:email')
  sendEmail(@Param('email') email: string, @Body() body: MailToProvisionerDto) {
    return this.provisionerService.sendEmailToProvisioner(
      email,
      'New Order',
      body,
    );
  }
}
