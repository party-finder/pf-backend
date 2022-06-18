import { forwardRef, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/Models/Group.schema';
import { JwtModule } from '@nestjs/jwt';
import { AppModule } from 'src/app.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
    ]),
    forwardRef(() => AppModule),
    UserModule
  ],
  providers: [GroupService],
  controllers: [GroupController],
  exports:[
    MongooseModule
  ]
})
export class GroupModule { }
