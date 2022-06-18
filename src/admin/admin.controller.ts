import { Controller, Delete, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Types } from 'mongoose';
import { BanGroupResponse, BanUserResponse } from 'src/responses/AdminResponses';
import { ErrorResponses } from 'src/responses/ErrorResponses';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { AdminService } from './admin.service';

@ApiTags("admin")
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @ApiOperation({ operationId: "ban/user/userId" })
    @ApiSecurity("admin")
    @ApiParam({
        name: "userId",
        required: true,
        example: "oawkfoq2ef1232safw1"
    })
    @ApiOkResponse({
        type: BanUserResponse
    })
    @ApiForbiddenResponse({
        type: ErrorResponses
    })
    @Roles("admin")
    @UseGuards(RolesGuard)
    @Delete("ban/user/:userId")
    async banUserById(@Res() res: Response<BanUserResponse | ErrorResponses>, @Param() param: { userId: Types.ObjectId }) {
        try {
            await this.adminService.banUserById(param.userId);
            return res.status(HttpStatus.OK).json({
                message: "Пользователь успешно забанен"
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.response,
            });
        }
    }

    @ApiOperation({ operationId: "ban/group/groupId" })
    @ApiSecurity("admin")
    @ApiParam({
        name: "groupId",
        required: true,
        example: "oawkfoq2ef1232safw1"
    })
    @ApiOkResponse({
        type: BanGroupResponse
    })
    @ApiForbiddenResponse({
        type: ErrorResponses
    })
    @Roles("admin")
    @UseGuards(RolesGuard)
    @Delete("ban/group/:groupId")
    async banGroupById(@Res() res: Response<BanGroupResponse | ErrorResponses>, @Param() param: { groupId: Types.ObjectId }) {
        try {
            await this.adminService.banGroupById(param.groupId);
            return res.status(HttpStatus.OK).json({
                message: "Группа успешно забанена"
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.response,
            });
        }
    }
}
