import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponses {

  @ApiProperty({
    example: "Текст ошибки",
    required: true,
  })
  readonly message:string
}
