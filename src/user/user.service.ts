import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User } from "src/Models/User.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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

}
