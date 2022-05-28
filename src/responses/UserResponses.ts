import { ApiProperty } from "@nestjs/swagger";

export class InfoResponse {
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
}