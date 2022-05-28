import { Body, Controller, Get, HttpStatus, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBasicAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'express';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GroupDto } from 'src/Models/dto/Group.dto';
import { GroupService } from './group.service';

@ApiTags("group")
@Controller('group')
export class GroupController {
    constructor(private groupService: GroupService) { }

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
    @Post("create")
    async create(
        @Res() res: Response<
            {
                lobbyId: mongoose.Types.ObjectId;
                title: string;
                description?: string;
                game: string;
                maxMembers: number;
                createdAt: string;
                user: {
                    username: string;
                }
            }
            |
            {
                message: string;
            }
        >,
        @Req() req: { user: { _id: mongoose.Types.ObjectId } },
        @Body() groupDto: GroupDto
    ) {
        try {
            const { _id, title, description, game, maxMembers, createdAt, user } =
                await this.groupService.createGroup(groupDto, req.user._id);
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

    @ApiOperation({})
    @ApiQuery({
        name: 'title',
        required: true,
        type: String,
        example: "title"
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: String,
        example: "10"
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: String,
        example: "1"
    })
    @ApiOkResponse({
        schema: {
            type: "array",
            items: {
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
                    example: "По запросу ничего не найдено",
                },
            },
            required: ["message"],
        },
    })
    @Get("search")
    async search(@Res() res: Response<
        Array<GroupDto>
        |
        {
            message: string;
        }
    >, @Query() query: {
        title: string;
        limit?: string;
        page?: string;
    }) {
        try {
            const result = await this.groupService.searchLobby(query)
            return res.status(HttpStatus.OK).json(result)
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.message,
            });
        }
    }
}
