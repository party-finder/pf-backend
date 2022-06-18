import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Role } from "./Role.schema";
import { User } from "./User.schema";

export type UserRolesDocument = UserRoles & Document;

@Schema()
export class UserRoles {
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name }]
    })
    roles: [Role]

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }]
    })
    users: [User]
}

export const UserRolesSchema = SchemaFactory.createForClass(UserRoles);