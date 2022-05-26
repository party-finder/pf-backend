import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
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

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
