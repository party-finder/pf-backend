import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleResponse {
    @ApiProperty({
        example: "Роль успешно создана",
        required: true,
      })
    readonly message: string;
}

export class AddRoleResponse {
  @ApiProperty({
      example: "Роль успешно добавлена пользователю",
      required: true,
    })
  readonly message: string;
}

export class RemoveRoleResponse {
  @ApiProperty({
    example: "Роль успешно удалена",
    required: true,
  })
readonly message: string;
}