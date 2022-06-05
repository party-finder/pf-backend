import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppService } from 'src/app.service';
import { GroupDto } from 'src/Models/dto/Group.dto';
import { Group } from 'src/Models/Group.schema';
import { User } from 'src/Models/User.schema';
import { CreateGroupResponse, GroupResponse } from 'src/responses/GroupResponses';

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
        _id: Types.ObjectId
    ): Promise<CreateGroupResponse> {
        const user = await this.userModel.findById({ _id });

        const lobby = new this.groupModel({
            title,
            description,
            game,
            maxMembers,
            createdAt: this.appService.setTime(0),
            creator: {
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
    }): Promise<Array<GroupResponse>> {
        let currentPage: number = parseInt(page);
        let currentLimit: number = parseInt(limit);
        const lowerCaseSearch = search.toLowerCase();
        if (isNaN(currentPage)) currentPage = 1;
        if (isNaN(currentLimit)) currentLimit = 10;
        if (currentLimit > 100) currentLimit = 100;

        const result = await this.groupModel
            .find({
                $or: [
                    { title: { $regex: lowerCaseSearch } },
                    { game: { $regex: lowerCaseSearch } }
                ]
            })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * currentLimit)
            .limit(currentLimit);

        return result;
    }

    async getGroup(groupId: Types.ObjectId): Promise<CreateGroupResponse> {
        return await this.groupModel.findById({ _id: groupId });
    }

    async getAllUserGroups(userId: Types.ObjectId): Promise<Array<CreateGroupResponse>> {
        const groups = await this.groupModel.find({ "user._id": userId });
        if (!groups.length) throw new HttpException("По запросу ничего не найдено", HttpStatus.NOT_FOUND);
        return groups;
    }

    async addParticipant(userId: Types.ObjectId, groupId: Types.ObjectId): Promise<GroupResponse> {
        const user = await this.userModel.findById({ _id: userId });
        const group = await this.groupModel.findOneAndUpdate(
            {
                _id: groupId
            },
            {
                $push: {
                    participants: {
                        _id: userId,
                        username: user.username
                    }
                }
            },
            {
                new: true
            })
        return group;
    }

    async addMember(groupId: Types.ObjectId, userId: Types.ObjectId): Promise<GroupResponse> {
        const user = await this.userModel.findById({ _id: userId });
        const group = await this.groupModel.findOneAndUpdate(
            {
                _id: groupId
            },
            {
                $push: {
                    members: {
                        _id: userId,
                        username: user.username
                    }
                },
                $pull: {
                    participants: {
                        _id: userId,
                        username: user.username
                    }
                }
            },
            {
                new: true
            }
        )
        return group;
    }
}
