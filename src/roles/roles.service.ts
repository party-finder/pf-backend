import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RolesDto } from 'src/Models/dto/Roles.dto';
import { Role } from 'src/Models/Role.schema';
import { User } from 'src/Models/User.schema';

@Injectable()
export class RolesService {

    constructor(
        @InjectModel(Role.name)
        private readonly roleModel: Model<Role>,
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }

    async createRole({ value, description }: RolesDto): Promise<void> {
        const existedRole = await this.roleModel.findOne({ value });
        if (existedRole) throw new HttpException("Такая роль уже существует", HttpStatus.BAD_REQUEST)

        const role = new this.roleModel({
            value,
            description
        })
        await role.save();
    }

    async addRole(roleId: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
        const role = await this.roleModel.findById({ _id: roleId });
        const user = await this.userModel.findById({ _id: userId })
        if (user.roles.find(userRole => userRole.value === role.value)) throw new HttpException("Такая роль у пользователя уже есть", HttpStatus.BAD_REQUEST)
        await await this.userModel.updateOne(
            {
                _id: userId
            },
            {
                $push: {
                    roles: {
                        ...role
                    }
                }
            }
        )
        await this.roleModel.updateOne(
            {
                _id: roleId
            },
            {
                $push: {
                    users: {
                        _id: user._id
                    }
                }
            }
        )
    }
}
