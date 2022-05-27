import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import mongoose from "mongoose";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GroupDto } from "src/Models/dto/Group.dto";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) { }

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
  async info(
    @Res()
    res: Response<
      | {
        username: string;
        email: string;
        createdAt: string;
      }
      | {
        message: string;
      }
    >,
    @Req() req: { user: { _id: mongoose.Types.ObjectId } }
  ) {
    try {
      const { username, email, createdAt } = await this.userService.getUser(req.user._id);
      return res.status(HttpStatus.OK).json({
        username,
        email,
        createdAt,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }

  @ApiOperation({})
  @ApiBasicAuth()
  @ApiCreatedResponse({
    schema: {
      type: "object",
      properties: {
        lobbyId: {
          type: "string",
          example: "3wtwegvdbvewf12wqe",
        },
        title: {
          type: "string",
          example: "Заголовок",
        },
        description: {
          type: "string",
          example: "Комментарий к лобби",
        },
        game: {
          type: "string",
          example: "игра",
        },
        maxMembers: {
          type: "number",
          example: 5,
        },
        createdAt: {
          type: "string",
          example: "Thu May 26 2022 19:51:02 GMT+0300 (Moscow Standard Time)",
        },
        user: {
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "dura2"
            }
          }
        }
      },
      required: ["lobbyId", "title", "game", "maxMembers", "createdAt", "user"],
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
  @Post("group")
  async group(
    @Res() res: Response<any>,
    @Req() req: { user: { _id: mongoose.Types.ObjectId } },
    @Body() groupDto: GroupDto
  ) {
    try {
      const { _id, title, description, game, maxMembers, createdAt, user } =
        await this.userService.createGroup(groupDto, req.user._id);
      return res.status(HttpStatus.OK).json({
        lobbyId: _id,
        title,
        description,
        game,
        maxMembers,
        createdAt,
        user,
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}

/*
          type: "object",
          properties: {
            username: {
              type: "string",
              example: "durak",
            },
            email: {
              type: "string",
              example: "test@test.ru",
            },
            password: {
              type: "string",
              example: "somepass",
            },
            createdAt: {
              type: "string",
              example: "Thu May 26 2022 19:51:02 GMT+0300 (Moscow Standard Time)",
            }
          },
*/