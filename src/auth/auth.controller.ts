import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RegisterDto } from "src/Models/dto/Register.dto";
import { LoginDto } from "src/Models/dto/Login.dto";
import { AuthService } from "./auth.service";
import { RefreshTokenDto } from "src/Models/dto/RefreshToken.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Response } from "express";
import mongoose from "mongoose";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({})
  @ApiCreatedResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Пользователь успешно создан",
        },
      },
      required: ["message"],
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Ошибка: Пользователь не был создан",
        },
      },
      required: ["message"],
    },
  })
  @Post("register")
  public async register(
    @Res() res: Response<{ message: string }>,
    @Body() registerDto: RegisterDto
  ) {
    try {
      await this.authService.register(registerDto);
      return res.status(HttpStatus.OK).json({
        message: "Пользователь успешно создан",
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }

  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
        },
        refreshToken: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv3v8",
        },
      },
      required: ["token", "refreshToken"],
    },
  })
  @ApiBadRequestResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Ошибка: неверный логин или пароль",
        },
      },
      required: ["message"],
    },
  })
  @Post("login")
  public async login(
    @Res()
    res: Response<
      | {
          token: string;
          refreshToken: string;
        }
      | {
          message: string;
        }
    >,
    @Body() loginDto: LoginDto
  ) {
    try {
      const auth = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json({
        token: auth.token,
        refreshToken: auth.refreshToken,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }

  @ApiOperation({})
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        token: {
          type: "string",
          example:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
        },
      },
      required: ["token"],
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Вы не авторизованы, попробуйте снова",
        },
      },
      required: ["message"],
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Токен не найден",
        },
      },
      required: ["message"],
    },
  })
  @Post("token")
  public async token(
    @Res()
    res: Response<
      | {
          token: string;
        }
      | {
          message: string;
        }
    >,
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    try {
      const auth = await this.authService.token(refreshTokenDto);
      return res.status(HttpStatus.OK).json({
        token: auth.token,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }

  @ApiOperation({})
  @ApiBasicAuth()
  @ApiHeader({
    name: "token",
    description:
      "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Успешный выход из учетной записи",
        },
      },
      required: ["message"],
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Возникла непредвиденная ошибка",
        },
      },
      required: ["message"],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Delete("logout")
  public async logout(
    @Res() res: Response<{ message: string }>,
    @Req() req: { user: { _id: mongoose.Types.ObjectId } }
  ) {
    try {
      await this.authService.logout(req.user._id);
      return res.status(HttpStatus.OK).json({
        message: "Успешный выход из учетной записи",
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }
}
