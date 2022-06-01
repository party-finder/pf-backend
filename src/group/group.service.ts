import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AppService } from 'src/app.service';
import { GroupDto } from 'src/Models/dto/Group.dto';
import { Group } from 'src/Models/Group.schema';
import { User } from 'src/Models/User.schema';
import { CreateGroupResponse } from 'src/responses/GroupResponses';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(Group.name)
        private readonly groupModel: Model<Group>,
        private appService: AppService
    ) { }

    async createGroup(
        { title, description, game, maxMembers }: GroupDto,
        _id: mongoose.Types.ObjectId
    ): Promise<CreateGroupResponse> {
        const user = await this.userModel.findById({ _id });

        const lobby = new this.groupModel({
            title,
            description,
            game,
            maxMembers,
            createdAt: this.appService.setTime(0),
            user: {
                _id: user._id,
                username: user.username,
            },
        });
        await lobby.save();
        return lobby;
    }

    async searchLobby({ search, limit, page }: {
        search: string;
        limit?: string;
        page?: string
    }): Promise<Array<CreateGroupResponse>> {
        let currentPage: number = parseInt(page);
        let currentLimit: number = parseInt(limit);
        if (isNaN(currentPage)) currentPage = 1;
        if (isNaN(currentLimit)) currentLimit = 10;

        const result = await this.groupModel
            .find({
                $or: [
                    { title: { $regex: search } },
                    { game: { $regex: search } }
                ]
            })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * currentLimit)
            .limit(currentLimit);
        if (!result.length) throw new HttpException("По запросу ничего не найдено", HttpStatus.NOT_FOUND);

        return result;
    }

    async getGroup(groupId: mongoose.Types.ObjectId): Promise<CreateGroupResponse> {
        return await this.groupModel.findById({ _id: groupId });
    }
}
