import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Group } from 'src/Models/Group.schema';
import { Token } from 'src/Models/Token.schema';
import { User } from 'src/Models/User.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(Group.name)
        private readonly groupModel: Model<Group>,
        @InjectModel(Token.name)
        private readonly tokenModel: Model<Token>
    ) { }

    async banUserById(_id: Types.ObjectId): Promise<void> {
        const user = await this.userModel.findById({ _id })
        await this.userModel.updateOne(
            {
                _id
            },
            {
                $set: {
                    isBanned: !user.isBanned
                }
            }
        )
        await this.tokenModel.findByIdAndDelete({ _id })
    }

    async banGroupById(_id: Types.ObjectId): Promise<void> {
        const group = await this.groupModel.findById({ _id })
        await this.groupModel.updateOne(
            {
                _id
            },
            {
                $set: {
                    isBanned: !group.isBanned
                }
            }
        )
    }
}
