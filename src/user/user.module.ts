import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/Models/User.schema";
import { Group, GroupSchema } from "src/Models/Group.schema";
import { AppModule } from "src/app.module";

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    forwardRef(() => AppModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [MongooseModule],
})
export class UserModule {}
