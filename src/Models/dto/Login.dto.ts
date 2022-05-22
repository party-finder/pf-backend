import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {

    @ApiProperty({
        example: "test@test.ru",
        required: true
    })
    @IsNotEmpty()
    readonly email:string;

    @ApiProperty({
        example: "somepass",
        required: true
    })
    @IsNotEmpty()
    readonly password:string;
}