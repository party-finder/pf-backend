import { Body, Controller, Delete, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Types } from 'mongoose';
import { RolesDto } from 'src/Models/dto/Roles.dto';
import { ErrorResponses } from 'src/responses/ErrorResponses';
import { AddRoleResponse, CreateRoleResponse, RemoveRoleResponse } from 'src/responses/RolesResponses';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';

@ApiTags("roles")
@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) { }

    @ApiOperation({})
    @ApiSecurity("admin")
    @Roles("admin")
    @UseGuards(RolesGuard)
    @ApiOkResponse({
        type: CreateRoleResponse,
    })
    @ApiBadRequestResponse({
        type: ErrorResponses,
    })
    @Post("create")
    async create(@Res() res: Response<CreateRoleResponse | ErrorResponses>, @Body() rolesDto: RolesDto) {
        try {
            await this.rolesService.createRole(rolesDto);
            return res.status(HttpStatus.OK).json({
                message: "Роль успешно создана"
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.response,
            });
        }
    }

    @ApiOperation({ operationId: "add/userId/roleId" })
    @ApiParam({
        name: "userId",
        required: true,
        example: "oawkfoq2ef1232safw1"
    })
    @ApiParam({
        name: "roleId",
        required: true,
        example: "oawkfoq2ef1232safw1"
    })
    @ApiSecurity("admin")
    @Roles("admin")
    @UseGuards(RolesGuard)
    @ApiOkResponse({
        type: AddRoleResponse,
    })
    @ApiBadRequestResponse({
        type: ErrorResponses,
    })
    @Post("add/:userId/:roleId")
    async addRole(
        @Res() res: Response<AddRoleResponse | ErrorResponses>,
        @Param() param: { roleId: Types.ObjectId; userId: Types.ObjectId }) {
        try {
            await this.rolesService.addRole(param.roleId, param.userId);
            return res.status(HttpStatus.OK).json({
                message: "Роль успешно добавлена пользователю"
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.response,
            });
        }
    }

    @ApiOperation({ operationId: "remove/userId/roleId" })
    @ApiSecurity("admin")
    @Roles("admin")
    @UseGuards(RolesGuard)
    @ApiParam({
        name: "userId",
        required: true,
        example: "oawkfoq2ef1232safw1"
    })
    @ApiParam({
        name: "roleId",
        required: true,
        example: "oawkfoq2ef1232safw1"
    })
    @ApiOkResponse({
        type: RemoveRoleResponse,
    })
    @ApiBadRequestResponse({
        type: ErrorResponses,
    })
    @Delete("remove/:userId/:roleId")
    async removeRole(
        @Res() res: Response<RemoveRoleResponse | ErrorResponses>,
        @Param() param: { roleId: Types.ObjectId; userId: Types.ObjectId }) {
        try {
            //await this.rolesService.addRole(addRoleDto.value, param.userId);
            return res.status(HttpStatus.OK).json({
                message: "Роль успешно удалена"
            });
        } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: err.response,
            });
        }
    }
}
