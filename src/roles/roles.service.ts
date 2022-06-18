import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesDto } from 'src/Models/dto/Roles.dto';
import { Role } from 'src/Models/Role.schema';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) { }

    async createRole({ value, description }: RolesDto): Promise<void> {
        const existedRole = await this.roleModel.findOne({ value });
        if (existedRole) throw new HttpException("Такая роль уже существует", HttpStatus.BAD_REQUEST)

        const role = new this.roleModel({
            value,
            description
        })
        await role.save();
    }
}
