import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GroupModule } from 'src/group/group.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [
    UserModule,
    GroupModule,
    AuthModule,
    JwtModule
  ]
})
export class AdminModule { }
