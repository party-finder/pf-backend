import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { User } from "../User.schema";

export class GroupDto {
  @ApiProperty({
    example: "my lobby",
    minLength: 3,
    maxLength: 48,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(48)
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: "Come to me, boys",
    required: false,
  })
  @IsString()
  @MaxLength(1000)
  readonly description: string;

  @ApiProperty({
    example: "genshin",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly game: string;

  @ApiProperty({
    example: 5,
    minLength: 2,
    maxLength: 24,
    required: true,
  })
  @IsNumber()
  @MinLength(2)
  @MaxLength(24)
  @IsNotEmpty()
  readonly maxMembers: number;

  readonly createdAt: string;

  readonly user: User;
}
