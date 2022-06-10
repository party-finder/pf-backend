import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { Types } from "mongoose";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GroupDto } from "src/Models/dto/Group.dto";
import { ErrorResponses } from "src/responses/ErrorResponses";
import { GroupResponse } from "src/responses/GroupResponses";
import { GroupService } from "./group.service";

@ApiTags("group")
@Controller("group")
export class GroupController {
  constructor(private groupService: GroupService) { }

  @ApiOperation({})
  @ApiBasicAuth()
  @ApiCreatedResponse({
    type: GroupResponse,
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @UseGuards(JwtAuthGuard)
  @Post("create")
  async create(
    @Res() res: Response<GroupResponse | ErrorResponses>,
    @Req() req: { user: { _id: Types.ObjectId } },
    @Body() groupDto: GroupDto
  ) {
    try {
      const group = await this.groupService.createGroup(groupDto, req.user._id);
      return res.status(HttpStatus.CREATED).json(group);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @ApiOperation({})
  @ApiQuery({
    name: "search",
    required: true,
    type: String,
    example: "title",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: String,
    example: "10",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: String,
    example: "1",
  })
  @ApiOkResponse({
    type: [GroupResponse],
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @Get("search")
  async search(
    @Res() res: Response<Array<GroupResponse> | ErrorResponses>,
    @Query()
    query: {
      search: string;
      limit?: string;
      page?: string;
    }
  ) {
    try {
      const result = await this.groupService.searchLobby(query);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @ApiOperation({ operationId: "groupId" })
  @ApiParam({
    name: "groupId",
    required: true,
    example: "oawkfoq2ef12321"
  })
  @ApiOkResponse({
    type: GroupResponse
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @Get(":groupId")
  async getGroupById(@Res() res: Response<GroupResponse | ErrorResponses>, @Param() param: { groupId: Types.ObjectId }) {
    try {
      const group = await this.groupService.getGroup(param.groupId);
      return res.status(HttpStatus.OK).json(group)
    } catch {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "По запросу ничего не найдено",
      });
    }
  }

  @ApiOperation({ operationId: "search/userId" })
  @ApiParam({
    name: "userId",
    required: true,
    example: "oawkfoq2ef1232safw1"
  })
  @ApiOkResponse({
    type: [GroupResponse]
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @Get("search/:userId")
  async getAllCreatedParty(@Res() res: Response<Array<GroupResponse> | ErrorResponses>, @Param() param: { userId: Types.ObjectId }) {
    try {
      const groups = await this.groupService.getAllUserGroups(param.userId)
      return res.status(HttpStatus.OK).json(groups)
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @ApiOperation({ operationId: "groupId/join" })
  @ApiParam({
    name: "groupId",
    required: true,
    example: "egwegw4gwrbfsbhr"
  })
  @ApiOkResponse({
    type: GroupResponse
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @ApiBasicAuth()
  @UseGuards(JwtAuthGuard)
  @Put(":groupId/join")
  async join(@Res() res: Response<GroupResponse | ErrorResponses>, @Req() req: { user: { _id: Types.ObjectId } }, @Param() param: { groupId: Types.ObjectId }) {
    try {
      const newGroup = await this.groupService.addParticipant(req.user._id, param.groupId);
      return res.status(HttpStatus.OK).json(newGroup)
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @ApiOperation({ operationId: "accept/groupId/userId" })
  @ApiParam({
    name: "groupId",
    required: true,
    example: "egwegw4gwrbfsbhr"
  })
  @ApiParam({
    name: "userId",
    required: true,
    example: "egwegw4gwrbfsbhr"
  })
  @ApiOkResponse({
    type: GroupResponse
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @ApiBasicAuth()
  @UseGuards(JwtAuthGuard)
  @Put("accept/:groupId/:userId")
  async accept(
    @Res() res: Response<GroupResponse | ErrorResponses>,
    @Param() param: { groupId: Types.ObjectId; userId: Types.ObjectId; },
    @Req() req: { user: { _id: Types.ObjectId } }
  ) {
    try {
      const newGroup = await this.groupService.addMember(param.groupId, param.userId, req.user._id)
      return res.status(HttpStatus.OK).json(newGroup)
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }

  @ApiOperation({ operationId: "kick/groupId/userId" })
  @ApiParam({
    name: "groupId",
    required: true,
    example: "egwegw4gwrbfsbhr"
  })
  @ApiParam({
    name: "userId",
    required: true,
    example: "egwegw4gwrbfsbhr"
  })
  @ApiOkResponse({
    type: GroupResponse
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @ApiBasicAuth()
  @UseGuards(JwtAuthGuard)
  @Put("kick/:groupId/:userId")
  async kick(
    @Res() res: Response<GroupResponse | ErrorResponses>,
    @Param() param: { groupId: Types.ObjectId; userId: Types.ObjectId; },
    @Req() req: { user: { _id: Types.ObjectId } }) {
    try {
      const newGroup = await this.groupService.deleteUser(param.groupId, param.userId, req.user._id)
      return res.status(HttpStatus.OK).json(newGroup)
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.message,
      });
    }
  }
}
