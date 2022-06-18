import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { GroupModule } from './group/group.module';
import { RolesModule } from './roles/roles.module';
import { AdminModule } from './admin/admin.module';

@Module({
  controllers: [],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV || "production"}.env`,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_DATABASE}?authSource=admin`
    ),
    forwardRef(() => AuthModule),
    forwardRef(() => GroupModule),
    forwardRef(() => UserModule),
    RolesModule,
    AdminModule,
  ],
  exports: [AppService],
})
export class AppModule { }
