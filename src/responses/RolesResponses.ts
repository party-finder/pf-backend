import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleResponse {
    @ApiProperty({
        example: "Роль успешно создана",
        required: true,
      })
    readonly message: string;
}