import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RegisterDto } from 'src/Models/dto/register.dto';
import { User } from 'src/Models/User.schema';
import * as bcrypt from "bcryptjs";
import { Token } from 'src/Models/Token.schema';
import { userIdDecoder } from 'src/userIdDecoder';

type UserId = {
    _id: mongoose.Types.ObjectId
}

type Options = {
    expire: string | number,
    secretKey: string | Buffer
}

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(Token.name)
        private readonly tokenModel: Model<Token>,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto): Promise<void> {
        const candidate = await this.userModel.findOne({ email: registerDto.email });
        if (candidate) throw new HttpException("Такой пользователь уже существует", HttpStatus.BAD_REQUEST);

        const hashPassword = await bcrypt.hash(registerDto.password, 5);

        const user = new this.userModel({ ...registerDto, password: hashPassword });
        await user.save();
    }

    async login({ email, password }: { email: string; password: string }): Promise<{
        token: string;
        refreshToken: string;
    }> {

        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException("Неверное имя пользователя или пароль", HttpStatus.BAD_REQUEST);

        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) throw new HttpException("Неверное имя пользователя или пароль", HttpStatus.BAD_REQUEST);

        const token = this.generateToken({ _id: user._id }, {
            expire: "3h",
            secretKey: process.env.SECRET || "secret"
        });
        const refreshToken = this.generateToken({ _id: user._id }, {
            expire: "30d",
            secretKey: process.env.REFRESH || "refresh"
        })
        const authToken = new this.tokenModel({
            _id: user._id,
            token,
            refreshToken,
            expireAt: this.setTokenTime(180),
            createdAt: this.setTokenTime(0)
        })
        await authToken.save()
        return {
            token,
            refreshToken
        }
    }

    async token({ refreshToken }: { refreshToken: string }): Promise<{ token: string }> {
        const refreshAuthToken: string | undefined = refreshToken;
        if (!refreshAuthToken) throw new HttpException("Вы не авторизованы, попробуйте снова", HttpStatus.UNAUTHORIZED);

        const userToken = await this.tokenModel.findOne({ _id: userIdDecoder(refreshAuthToken) })
        if (!userToken) throw new HttpException("Токен не найден", HttpStatus.FORBIDDEN);

        const newToken = this.generateToken({ _id: userToken._id }, {
            expire: "3h",
            secretKey: process.env.SECRET || "secret"
        })

        await this.tokenModel.updateOne({ _id: userToken._id }, {
            $set: {
                token: newToken,
                expireAt: this.setTokenTime(180),
                createdAt: this.setTokenTime(0)
            }
        });

        return {
            token: newToken
        }
    }

    async logout({ token }:{token:string}): Promise<void> {
        if (!token) throw new HttpException("Возникла непредвиденная ошибка", HttpStatus.BAD_REQUEST)
        await this.tokenModel.deleteOne({ _id: userIdDecoder(token) });
    }

    private generateToken(userId: UserId, { expire, secretKey }: Options): string {
        return this.jwtService.sign({ _id: userId._id }, { expiresIn: expire, secret: secretKey })
    }

    private setTokenTime(minutes: number): string {
        const copiedDate = new Date();
        copiedDate.setTime(copiedDate.getTime() + (minutes * 60 * 1000));
        return copiedDate.toString();
    }
}
