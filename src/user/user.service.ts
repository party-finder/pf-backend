import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { AppService } from "src/app.service";
import { GroupDto } from "src/Models/dto/Group.dto";
import { Group } from "src/Models/Group.schema";
import { User } from "src/Models/User.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
    private appService: AppService
  ) { }

  async getUser(_id: mongoose.Types.ObjectId): Promise<{
    username: string;
    email: string;
    createdAt: string;
  }> {
    const user = await this.userModel.findById({ _id });
    if (!user) throw new HttpException("Пользователь не найден", HttpStatus.BAD_REQUEST);
    const { username, email, createdAt } = user;
    return {
      username,
      email,
      createdAt,
    };
  }

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
        username: user.username,
      },
    });
    await lobby.save();
    return lobby;
  }
}
