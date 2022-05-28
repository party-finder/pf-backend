import { Controller, Get, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import mongoose from "mongoose";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ErrorResponses } from "src/responses/ErrorResponses";
import { InfoResponse } from "src/responses/UserResponses";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({})
  @ApiBasicAuth()
  @ApiOkResponse({
    type: InfoResponse,
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @UseGuards(JwtAuthGuard)
  @Get("info")
  async info(
    @Res() res: Response<InfoResponse | ErrorResponses>,
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
}
