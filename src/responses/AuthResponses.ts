import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponse {
  @ApiProperty({
    example: "Пользователь успешно создан",
    required: true,
  })
  readonly message: string;
}

export class LoginResponse {
  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
  })
  readonly token: string;

  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv3v8",
    required: true,
  })
  readonly refreshToken: string;
}

export class TokenResponse {
  @ApiProperty({
    type: "string",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
  })
  readonly token: string;
}

export class LogoutResponse {
  @ApiProperty({
    example: "Успешный выход из учетной записи",
    required: true,
  })
  readonly message: string;
}
