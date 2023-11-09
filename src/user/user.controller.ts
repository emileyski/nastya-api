import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { User } from 'src/core/decorators/user.decorator';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from 'src/core/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Genders } from 'src/core/enums/gender.enum';
import { Roles } from 'src/core/enums/roles.enum';
import { Role } from 'src/core/decorators/role.decorator';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/file-upload.utils';

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

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: imageFileFilter,
    }),
  )
  @Put()
  async update(
    @UserId() userId: string,
    @Body() userData: CreateUserDto,

    @UploadedFile() picture,
  ) {
    const user = await this.userService.update(userId, userData, picture);

    return this.userService.createReturnableUser(user);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('profile')
  @UseGuards(AccessTokenGuard)
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
}
