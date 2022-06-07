import { ApiProperty } from "@nestjs/swagger";

class Contacts {
  @ApiProperty({
    example: "somediscord",
    required: false,
  })
  readonly discord: string | undefined;

  @ApiProperty({
    example: "someskype",
    required: false,
  })
  readonly skype: string | undefined;

  @ApiProperty({
    example: "someteamspeak",
    required: false,
  })
  readonly teamspeak: string | undefined;
}

export class UserResponse {
  @ApiProperty({
    example: "dura2",
    required: true,
  })
  readonly username: string;

  @ApiProperty({
    example: "test@test.ru",
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: "Thu May 26 2022 19:29:10 GMT+0300 (Moscow Standard Time)",
    required: true,
  })
  readonly createdAt: string;

  @ApiProperty({
    type: Contacts,
    required: true,
  })
  readonly contacts: Contacts;
}