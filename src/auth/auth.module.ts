import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    JwtModule,
    forwardRef(() => UserModule),
    FilesModule,
    // ClientsModule.register([
    //   {
    //     name: 'AUTH_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5672'], //TODO: test this
    //       queue: 'main_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
  ],
  controllers: [AuthController],
  providers: [AccessTokenStrategy, RefreshTokenStrategy, AuthService],
  exports: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
