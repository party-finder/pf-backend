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

  @Prop()
  lastOnline: string;

  @Prop({ type: Object })
  contacts: {
    discord: string | undefined;
    skype: string | undefined;
    teamspeak: string | undefined;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
