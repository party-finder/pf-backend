import { ApiProperty } from "@nestjs/swagger";

export class BanUserResponse {
    @ApiProperty({
        example: "Пользователь успешно забанен",
        required: true,
    })
    readonly message: string;
}

export class BanGroupResponse {

    @ApiProperty({
        example: "Группа успешно забанена",
        required: true,
    })
    readonly message: string;
}