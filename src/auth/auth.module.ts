import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from 'src/Models/Token.schema';
import { User, UserSchema } from 'src/Models/User.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema }
    ]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    JwtModule
  ]
})
export class AuthModule { }
