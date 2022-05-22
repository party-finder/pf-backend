import { Body, Controller, Delete, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBasicAuth, ApiCreatedResponse,
    ApiForbiddenResponse, ApiHeader, ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { RegisterDto } from 'src/Models/dto/Register.dto';
import { LoginDto } from 'src/Models/dto/Login.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from 'src/Models/dto/RefreshToken.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface Response<T> {
    status(arg0: number): any;
    json(arg0: T): any
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @ApiOperation({})
    @ApiCreatedResponse({
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Пользователь успешно создан"
                }
            }
        }
    })
    @ApiBadRequestResponse({
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Ошибка: Пользователь не был создан"
                }
            }
        }
    })
    @Post("register")
    public async register(@Res() res: Response<{ message: string }>, @Body() registerDto: RegisterDto): Promise<{ message: string }> {
        try {
            await this.authService.register(registerDto);
            return res.status(HttpStatus.OK).json({
                message: "Пользователь успешно создан"
            });
        } catch (err) {
            return res.json({
                message: err.response
            })
        }
    }

    @ApiOperation({})
    @ApiCreatedResponse({
        schema: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
                },
                refreshToken: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv3v8"
                }
            }
        }
    })
    @ApiBadRequestResponse({
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Ошибка: неверный логин или пароль"
                }
            }
        }
    })
    @Post("login")
    public async login(@Res() res: Response<
        {
            token: string;
            refreshToken: string
        }
        |
        {
            message: string
        }>,
        @Body() loginDto: LoginDto) {
        try {
            const auth = await this.authService.login(loginDto);
            return res.status(HttpStatus.OK).json({
                token: auth.token,
                refreshToken: auth.refreshToken
            });
        } catch (err) {
            return res.json({
                message: err.response
            })
        }
    }

    @ApiOperation({})
    @ApiCreatedResponse({
        schema: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39",
                }
            }
        }
    })
    @ApiUnauthorizedResponse({
        description: "Вы не авторизованы, попробуйте снова"
    })
    @ApiForbiddenResponse({
        description: "Токен не найден"
    })
    @Post("token")
    public async token(@Res() res: Response<
        {
            token: string;
        }
        |
        {
            message: string;
        }
    >, @Body() refreshTokenDto: RefreshTokenDto) {
        try {
            const auth = await this.authService.token(refreshTokenDto);
            return res.status(HttpStatus.OK).json({
                token: auth.token
            });
        } catch (err) {
            return res.json({
                message: err.response
            })
        }
    }

    @ApiOperation({})
    @ApiBasicAuth()
    @ApiHeader({
        name: "token",
        description: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmRjMjg1ZmM2OTk1ZTBmZTAxOGZlMWUiLCJpYXQiOjE2MDg0MzU5MjB9.U93_wqFcW95Rzf-gJakrq8mjsqwgrKpEBO34n6Kv39"
    })
    @ApiCreatedResponse({
        description: "Успешный выход из учетной записи"
    })
    @ApiUnauthorizedResponse({
        description: "Возникла непредвиденная ошибка"
    })
    @UseGuards(JwtAuthGuard)
    @Delete("logout")
    public async logout(@Res() res: Response<{ message: string; }>, @Req() req: { headers: { token: string } }) {
        try {
            await this.authService.logout(req.headers);
            return res.status(HttpStatus.OK).json({
                message: "Успешный выход из учетной записи"
            });
        } catch (err) {
            return res.json({
                message: err.response
            })
        }
    }
}
