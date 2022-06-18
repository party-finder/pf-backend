import { ApiProperty } from "@nestjs/swagger";
import mongoose from "mongoose";

class UserInfoResponse {
  @ApiProperty({
    example: "3wtwegvdbvewf12wqe",
    required: true,
    type: String
  })
  readonly _id: mongoose.Types.ObjectId;

  @ApiProperty({
    example: "dura2",
    required: true,
  })
  readonly username: string;
}

class UserOnlineResponse extends UserInfoResponse {
  @ApiProperty({
    example: "Thu May 26 2022 19:51:02 GMT+0300 (Moscow Standard Time)",
    required: true,
  })
  readonly lastOnline: string;
}

export class GroupResponse {
  @ApiProperty({
    example: "3wtwegvdbvewf12wqe",
    required: true,
    type: String
  })
  readonly _id: mongoose.Types.ObjectId;

  @ApiProperty({
    example: "Заголовок",
    required: true,
  })
  readonly title: string;

  @ApiProperty({
    example: "Комментарий к лобби",
    required: false,
  })
  readonly description: string;

  @ApiProperty({
    example: "Игра",
    required: true,
  })
  readonly game: string;

  @ApiProperty({
    example: false,
    required: true
  })
  readonly isBanned: boolean;

  @ApiProperty({
    example: true,
    required: true
  })
  readonly isActive: boolean;

  @ApiProperty({
    example: 5,
    required: true,
  })
  readonly maxMembers: number;

  @ApiProperty({
    example: "Thu May 26 2022 19:51:02 GMT+0300 (Moscow Standard Time)",
    required: true,
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: UserInfoResponse,
    required: true,
  })
  readonly creator: UserInfoResponse;

  @ApiProperty({
    type: [UserOnlineResponse],
    required: true,
  })
  readonly members: [UserOnlineResponse];

  @ApiProperty({
    type: [UserInfoResponse],
    required: true,
  })
  readonly participants: [UserInfoResponse];
}