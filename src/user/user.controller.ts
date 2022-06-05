import { Body, Controller, Get, HttpStatus, Put, Req, Res, UseGuards } from "@nestjs/common";
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
import { ContactsDto } from "src/Models/dto/Contacts.dto";
import { ErrorResponses } from "src/responses/ErrorResponses";
import { UserResponse } from "src/responses/UserResponses";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private userService: UserService) { }

  @ApiOperation({})
  @ApiBasicAuth()
  @ApiOkResponse({
    type: UserResponse,
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @UseGuards(JwtAuthGuard)
  @Get("info")
  async info(
    @Res() res: Response<UserResponse | ErrorResponses>,
    @Req() req: { user: { _id: mongoose.Types.ObjectId } }
  ) {
    try {
      const user = await this.userService.getUser(req.user._id);
      return res.status(HttpStatus.OK).json(user);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }

  @ApiOperation({})
  @ApiCreatedResponse({
    type: UserResponse,
  })
  @ApiBadRequestResponse({
    type: ErrorResponses,
  })
  @ApiBasicAuth()
  @UseGuards(JwtAuthGuard)
  @Put("contacts")
  async contacts(@Res() res: Response<UserResponse | ErrorResponses>, @Req() req: { user: { _id } }, @Body() contactsDto: ContactsDto) {
    try {
      const user = await this.userService.addContacts(req.user._id, contactsDto);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: err.response,
      });
    }
  }
}
