import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Models/User.schema';
import { userIdDecoder } from 'src/userIdDecoder';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) { }

    async getUser({ token }: { token: string }): Promise<{
        username: string;
        email: string;
        createdAt: string;
    }> {
        const user = await this.userModel.findById({ _id: userIdDecoder(token) });
        if (!user) throw new HttpException("Пользователь не найден", HttpStatus.BAD_REQUEST);
        const { username, email, createdAt } = user;
        return {
            username,
            email,
            createdAt
        }
    }
}
