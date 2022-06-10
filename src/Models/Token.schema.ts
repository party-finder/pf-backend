import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  token: string;

  @Prop()
  refreshToken: string;

  @Prop()
  expireAt: Date;

  @Prop()
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
