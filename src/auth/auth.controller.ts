import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
import {
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  TokenResponse,
} from "src/responses/AuthResponses";
import { ErrorResponses } from "src/responses/ErrorResponses";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({})
  @ApiCreatedResponse({
    type: RegisterResponse,
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @Post("register")
  public async register(
    @Res() res: Response<RegisterResponse | ErrorResponses>,
    @Body() registerDto: RegisterDto
  ) {
    try {
      await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json({
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
    type: LoginResponse,
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @Post("login")
  public async login(
    @Res() res: Response<LoginResponse | ErrorResponses>,
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
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponses,
  })
  @ApiForbiddenResponse({
    type: ErrorResponses,
  })
  @Post("token")
  public async token(
    @Res() res: Response<TokenResponse | ErrorResponses>,
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
  @ApiOkResponse({
    type: LogoutResponse,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponses,
  })
  @UseGuards(JwtAuthGuard)
  @Delete("logout")
  public async logout(
    @Res() res: Response<LogoutResponse | ErrorResponses>,
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
