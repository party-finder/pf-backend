import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TokenDocument = Token & Document;

@Schema()
export class Token {
    @Prop()
    token: string;

    @Prop()
    refreshToken: string;

    @Prop()
    expireAt: string;

    @Prop()
    createdAt: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);