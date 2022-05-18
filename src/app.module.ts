import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './Models/User.schema';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{name: "user", schema: UserSchema }]),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    MongooseModule.forRoot(`mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.URL}/${process.env.DATABASE}?authSource=admin`)
  ],
})
export class AppModule { }
