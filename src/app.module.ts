import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";

@Module({
  controllers: [],
  providers: [],
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV || "production"}.env`,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_DATABASE}?authSource=admin`
    ),
  ],
})
export class AppModule {}
