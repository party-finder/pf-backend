import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AppModule } from "src/app.module";
import { Token, TokenSchema } from "src/Models/Token.schema";
import { RolesModule } from "src/roles/roles.module";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({}),
    UserModule,
    forwardRef(() => AppModule),
    RolesModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    JwtModule,
    MongooseModule
  ],
})
export class AuthModule { }
