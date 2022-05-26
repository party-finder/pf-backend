import { Controller, Get, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UsersService } from "./users.service";

@ApiTags("user")
@Controller("user")
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({})
    @ApiBasicAuth()
    @ApiOkResponse({
        schema: {
            type: "object",
            properties: {
                username: {
                    type: "string",
                    example: "dura2",
                },
                email: {
                    type: "string",
                    example: "test@test.ru",
                },
                createdAt: {
                    type: "string",
                    example: "Thu May 26 2022 19:29:10 GMT+0300 (Moscow Standard Time)",
                },
            },
            required: ["username", "email", "createdAt"],
        },
    })
    @ApiBadRequestResponse({
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Пользователь не найден",
                },
            },
            required: ["message"],
        },
    })
    @UseGuards(JwtAuthGuard)
    @Get("info")
    async info(@Res() res: Response<
        {
            username: string;
            email: string;
            createdAt: string;
        }
        |
        {
            message: string;
        }
    >,
        @Req() req: { headers: { token: string } }) {
        try {
            const { username, email, createdAt } = await this.usersService.getUser(req.headers);
            return res.status(HttpStatus.OK).json({
                username,
                email,
                createdAt
            })
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.response,
            });
        }
    }
}
