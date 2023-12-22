import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from 'src/core/interfaces/tokens.interface';
import { Public } from 'src/core/decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { UserId } from 'src/core/decorators/user-id.decorator';
import { RefreshTokenGuard } from 'src/core/guards/refresh-token.guard';
import { User } from 'src/core/decorators/user.decorator';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('sign-in')
  @Public()
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    console.log(signInDto);
    return this.authService.signIn(signInDto);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(AccessTokenGuard)
  @Post('log-out')
  @HttpCode(200)
  logOut(@UserId() userId: string): void {
    return this.authService.logOut(userId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Invalid refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  refresh(
    @UserId() userId: string,
    @User('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
