import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AppService } from 'src/app.service';
import { GroupDto } from 'src/Models/dto/Group.dto';
import { Group } from 'src/Models/Group.schema';
import { User } from 'src/Models/User.schema';

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
    ) {
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

    async searchLobby({ title, limit, page }: {
        title: string;
        limit?: string;
        page?: string
    }) {
        let currentPage: number = parseInt(page);
        let currentLimit: number = parseInt(limit);
        if (isNaN(currentPage)) currentPage = 1;
        if (isNaN(currentLimit)) currentLimit = 10;

        const result = await this.groupModel
            .find({ title: { $regex: title } })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * currentLimit)
            .limit(currentLimit);
        if (!result.length) throw new HttpException("По запросу ничего не найдено", HttpStatus.BAD_REQUEST);

        return result;
    }
}
