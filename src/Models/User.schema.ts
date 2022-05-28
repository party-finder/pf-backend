import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;
  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
