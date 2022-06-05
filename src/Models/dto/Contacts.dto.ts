import { ApiProperty } from "@nestjs/swagger";

export class ContactsDto {
  @ApiProperty({
    example: "somediscord",
    required: false,
  })
  readonly discord: string;

  @ApiProperty({
    example: "someskype",
    required: false,
  })
  readonly skype: string;


  @ApiProperty({
    example: "someteamspeak",
    required: false,
  })
  readonly teamspeak: string;
}