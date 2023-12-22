import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ProvisionerService } from './provisioner.service';
import { CreateProvisionerDto } from './dto/create-provisioner.dto';
import { UpdateProvisionerDto } from './dto/update-provisioner.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { Public } from 'src/core/decorators/public.decorator';
import { MailToProvisionerDto } from './dto/mail-to-provisioner.dto';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Role } from 'src/core/decorators/role.decorator';
import { Roles } from 'src/core/enums/roles.enum';

@ApiTags('provisioner')
@Controller('provisioner')
export class ProvisionerController {
  constructor(private readonly provisionerService: ProvisionerService) {}

  @ApiOperation({
    summary: 'Create a provisioner',
    description: 'Create a provisioner',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createProvisionerDto: CreateProvisionerDto) {
    return this.provisionerService.create(createProvisionerDto);
  }

  @ApiOperation({
    summary: 'Get all provisioners',
    description:
      'Get all provisioners (this method is only for admins), you can filter by name, add pagination (page, perPage)',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    description: 'Users per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    description: 'User name',
    required: false,
    example: 'John',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('name') name: string,
  ) {
    return this.provisionerService.findAll(page, perPage, name);
  }

  @ApiOperation({
    summary: 'Get provisioner by id',
    description: 'Get provisioner by id',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provisionerService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProvisionerDto: UpdateProvisionerDto,
  ) {
    return this.provisionerService.update(id, updateProvisionerDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
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
