import { ApiProperty } from "@nestjs/swagger";

export class RolesDto {
    @ApiProperty({
        example: "admin",
        minLength: 1,
        maxLength: 24,
        required: true
    })
    readonly value:string;

    @ApiProperty({
        example: "can create group",
        minLength: 2,
        maxLength: 256,
        required: true
    })
    readonly description:string;
}