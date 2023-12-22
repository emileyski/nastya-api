import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { User } from 'src/core/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Genders } from 'src/core/enums/gender.enum';
import { Roles } from 'src/core/enums/roles.enum';
import { Role } from 'src/core/decorators/role.decorator';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/file-upload.utils';
import { RoleGuard } from 'src/core/guards/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //TODO: remove this
  @Public()
  @Post('create-admin')
  async createAdmin() {
    const adminData: CreateUserDto = {
      email: 'admin@gmail.com',
      name: 'Admin',
      password: 'admin',
      birthDate: new Date('2000-01-01'),
      role: Roles.ADMIN,
      gender: Genders.MALE,
    };

    const user = await this.userService.create(adminData);
    return this.userService.createReturnableUser(user);
  }

  @ApiOperation({
    summary: 'Create an employee (admin only)',
    description: 'Create an employee (this method is only for admins)',
  })
  @ApiBearerAuth()
  @Role(Roles.ADMIN)
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  async create(
    @UserId() userId: string,
    @Body() userData: CreateUserDto,
    @UploadedFile() picture,
  ) {
    const user = await this.userService.create(userData, picture);

    return this.userService.createReturnableUser(user);
  }

  @ApiOperation({
    summary: 'Get all users (admin only)',
    description: 'Get all users (this method is only for admins)',
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
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Get()
  findAll(
    @Query('name') name = '',
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ) {
    return this.userService.findAll(
      parseInt(page.toString()),
      parseInt(perPage.toString()),
      name,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  // @UseInterceptors(
  //   FileInterceptor('picture', {
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  @Put(':id')
  async update(
    @Param('id') userId: string,
    @Body() userData: UpdateUserDto,
    // @UploadedFile() picture,
  ) {
    const user = await this.userService.update(userId, userData);

    return this.userService.createReturnableUser(user);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile(@User('id') userId: string) {
    const userData = await this.userService.findOne(userId);

    console.log(userData);

    if (userData.picture) {
      //TODO: change to env variable
      userData.picture = `http://localhost:3000/api/files/${userData.picture}`;
    }

    delete userData.password;
    delete userData.token;

    return userData;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  async delete(@Param('id') userId: string) {
    return this.userService.delete(userId);
  }
}
