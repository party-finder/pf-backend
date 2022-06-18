import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./User.schema";

export type RoleDocument = Role & Document;

@Schema()
export class Role {
    @Prop({ unique: true })
    value: string;

    @Prop()
    description: string;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
    })
    users: [User]
}

export const RoleSchema = SchemaFactory.createForClass(Role);