import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/Models/Role.schema';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
    UserModule,
    JwtModule
  ],
  exports: [
    MongooseModule
  ],
})
export class RolesModule { }
