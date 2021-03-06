import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppService } from 'src/app.service';
import { GroupDto } from 'src/Models/dto/Group.dto';
import { Group } from 'src/Models/Group.schema';
import { User } from 'src/Models/User.schema';
import { GroupResponse } from 'src/responses/GroupResponses';

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
    ): Promise<GroupResponse> {
        const user = await this.userModel.findById({ _id });

        const lobby = new this.groupModel({
            title,
            description,
            game,
            maxMembers,
            createdAt: this.appService.setTime(0),
            isBanned: false,
            isActive: true,
            creator: {
                _id: user._id,
                username: user.username,
            },
            members: {
                _id: user._id,
                username: user.username,
                lastOnline: user.lastOnline
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
        if (isNaN(currentPage)) currentPage = 1;
        if (isNaN(currentLimit)) currentLimit = 10;
        if (currentLimit > 100) currentLimit = 100;

        const result = await this.groupModel
            .find({
                $or: [
                    {
                        title: { $regex: search, $options: "i" },
                        isBanned: false
                    },
                    {
                        game: { $regex: search, $options: "i" },
                        isBanned: false
                    }
                ]
            })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * currentLimit)
            .limit(currentLimit);

        return result;
    }

    async getGroup(groupId: Types.ObjectId): Promise<GroupResponse> {
        return await this.groupModel.findById({ _id: groupId });
    }

    async getAllUserGroups(userId: Types.ObjectId): Promise<Array<GroupResponse>> {
        const groups = await this.groupModel.find({ "user._id": userId });
        if (!groups.length) throw new HttpException("???? ?????????????? ???????????? ???? ??????????????", HttpStatus.NOT_FOUND);
        return groups;
    }

    async addParticipant(userId: Types.ObjectId, groupId: Types.ObjectId): Promise<GroupResponse> {
        const user = await this.userModel.findById({ _id: userId });
        const group = await this.groupModel.findById({ _id: groupId })

        if (group.participants.find(participant => participant.username === user.username)) {
            throw new HttpException("???????????????????????? ?????? ???????????????? ?? ????????????", HttpStatus.BAD_REQUEST)
        }

        if (group.members.find(member => member.username === user.username)) {
            throw new HttpException("???????????????????????? ?????? ?????????? ????????????", HttpStatus.BAD_REQUEST)
        }

        const newGroup = await this.groupModel.findByIdAndUpdate(
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
            }
        )

        return newGroup;
    }

    async addMember(groupId: Types.ObjectId, userId: Types.ObjectId, _id: Types.ObjectId): Promise<GroupResponse> {
        const user = await this.userModel.findById({ _id: userId });
        const group = await this.groupModel.findById({ _id: groupId });

        if (group.creator._id.toString() !== _id.toString()) {
            throw new HttpException("???????????? ???????????????? ???????????? ?????????? ?????????????????? ??????????????????????????", HttpStatus.BAD_REQUEST)
        }

        if (group.members.find(member => member.username === user.username)) {
            throw new HttpException("???????????????????????? ?????? ?????????? ????????????", HttpStatus.BAD_REQUEST)
        }

        if (!group.participants.find(participant => participant.username === user.username)) {
            throw new HttpException("???????????? ???????????????????????? ??????????????????????", HttpStatus.BAD_REQUEST)
        }

        const newGroup = await this.groupModel.findByIdAndUpdate(
            {
                _id: groupId
            },
            {
                $push: {
                    members: {
                        _id: userId,
                        username: user.username,
                        lastOnline: user.lastOnline
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

        return newGroup;
    }

    async deleteUser(groupId: Types.ObjectId, userId: Types.ObjectId, _id: Types.ObjectId): Promise<GroupResponse> {
        const user = await this.userModel.findById({ _id: userId });
        const group = await this.groupModel.findById({ _id: groupId });

        if (group.creator._id.toString() !== _id.toString()) {
            throw new HttpException("???????????? ???????????????? ???????????? ?????????? ?????????????? ??????????????????????????", HttpStatus.BAD_REQUEST)
        }

        if (!group.members.find(member => member.username === user.username) && !group.participants.find(participant => participant.username === user.username)) {
            throw new HttpException("???????????????????????? ???? ????????????", HttpStatus.BAD_REQUEST)
        }

        if (group.members.find(member => member.username === user.username)) {
            const newGroup = await this.groupModel.findByIdAndUpdate(
                { _id: groupId },
                {
                    $pull: {
                        members: {
                            _id: userId,
                            username: user.username,
                        }
                    }
                },
                {
                    new: true
                }
            )
            return newGroup;
        } else {
            const newGroup = await this.groupModel.findByIdAndUpdate(
                { _id: groupId },
                {
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
            return newGroup;
        }
    }

    async closeGroup(groupId: Types.ObjectId, userId: Types.ObjectId):Promise<GroupResponse> {
        const group = await this.groupModel.findById({ _id: groupId })
        if (group.creator._id.toString() !== userId.toString())
            throw new HttpException("???? ?????????? ?????????????? ????????????", HttpStatus.BAD_REQUEST)

        const newGroup = await this.groupModel.findByIdAndUpdate(
            {
                _id: groupId
            },
            {
                $set: {
                    isActive: false
                }
            },
            {
                new: true
            }
        )
        return newGroup
    }
}
