import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RolesDto } from 'src/Models/dto/Roles.dto';
import { ErrorResponses } from 'src/responses/ErrorResponses';
import { CreateRoleResponse } from 'src/responses/RolesResponses';
import { RolesService } from './roles.service';

@ApiTags("roles")
@Controller('roles')
export class RolesController {

    constructor(private rolesService: RolesService) { }

    @ApiOperation({})
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
}
