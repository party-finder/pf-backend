import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {

    @ApiProperty({
        example: "durak",
        minLength: 3,
        maxLength: 24,
        required: true
    })
    @IsString()
    @MaxLength(24)
    @MinLength(3)
    readonly username: string;

    @ApiProperty({
        example: "test@test.ru",
        maxLength: 128,
        required: true
    })
    @IsString()
    @MaxLength(128)
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({ 
        example: "somepass",
        minLength: 8,
        maxLength: 128,
        required: true
    })
    @IsString()
    @MaxLength(128)
    @MinLength(8)
    readonly password: string;

}