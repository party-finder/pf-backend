import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./User.schema";

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  game: string;

  @Prop()
  maxMembers: number;

  @Prop()
  createdAt: string;

  @Prop(raw([
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
      },
      username: {
        type: String,
      }
    }
  ]))
  participants: [User]

  @Prop(raw([
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
      },
      username: {
        type: String,
      },
      lastOnline: {
        type: String,
      }
    }
  ]))
  members: [User]

  @Prop(raw({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.name,
    },
    username: {
      type: String,
    }
  }))
  creator: User;
}

export const GroupSchema = SchemaFactory.createForClass(Group);