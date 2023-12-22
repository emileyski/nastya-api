import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'admin@gmail.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ description: 'The password of the user', example: 'admin' })
  @IsString()
  @Length(4, 20)
  readonly password: string;
}
