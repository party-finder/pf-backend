import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Role } from "./Role.schema";

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
  createdAt: Date;

  @Prop()
  lastOnline: string;

  @Prop()
  isBanned: boolean;

  @Prop({ type: Object })
  contacts: {
    discord: string | undefined;
    skype: string | undefined;
    teamspeak: string | undefined;
  }

  @Prop(raw([{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Role.name,
    },
    value: {
      type: String,
    }
  }]))
  roles: [Role]
}

export const UserSchema = SchemaFactory.createForClass(User);
