import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { RegisterDto } from "src/Models/dto/Register.dto";
import { User } from "src/Models/User.schema";
import * as bcrypt from "bcryptjs";
import { Token } from "src/Models/Token.schema";
import { LoginDto } from "src/Models/dto/Login.dto";
import { RefreshTokenDto } from "src/Models/dto/RefreshToken.dto";
import { AppService } from "src/app.service";

type UserId = {
  _id: mongoose.Types.ObjectId;
};

type Options = {
  expire: string | number;
  secretKey: string | Buffer;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<Token>,
    private jwtService: JwtService,
    private appService: AppService
  ) {}

  async register({ username, email, password }: RegisterDto): Promise<void> {
    const candidate = await this.userModel.findOne({ email });
    if (candidate)
      throw new HttpException("Такой пользователь уже существует", HttpStatus.BAD_REQUEST);

    const hashPassword = await bcrypt.hash(password, 5);

    const user = new this.userModel({
      username,
      email,
      password: hashPassword,
      createdAt: this.appService.setTime(0),
    });
    await user.save();
  }

  async login({ email, password }: LoginDto): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException("Неверное имя пользователя или пароль", HttpStatus.BAD_REQUEST);

    const activeUser = await this.tokenModel.findById({ _id: user._id })
    if (activeUser) await activeUser.deleteOne({ _id: user._id })

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      throw new HttpException("Неверное имя пользователя или пароль", HttpStatus.BAD_REQUEST);

    const token = this.generateToken(
      { _id: user._id },
      {
        expire: "3h",
        secretKey: process.env.SECRET || "secret",
      }
    );
    const refreshToken = this.generateToken(
      { _id: user._id },
      {
        expire: "30d",
        secretKey: process.env.REFRESH || "refresh",
      }
    );
    const authToken = new this.tokenModel({
      _id: user._id,
      token,
      refreshToken,
      expireAt: this.appService.setTime(180),
      createdAt: this.appService.setTime(0),
    });
    await authToken.save();
    return {
      token,
      refreshToken,
    };
  }

  async token({ refreshToken }: RefreshTokenDto): Promise<{ token: string }> {
    const refreshAuthToken: string | undefined = refreshToken;
    if (!refreshAuthToken)
      throw new HttpException("Вы не авторизованы, попробуйте снова", HttpStatus.UNAUTHORIZED);

    const userToken = await this.tokenModel.findOne({
      _id: this.userIdDecoder(refreshAuthToken),
    });
    if (!userToken) throw new HttpException("Токен не найден", HttpStatus.FORBIDDEN);

    const newToken = this.generateToken(
      { _id: userToken._id },
      {
        expire: "3h",
        secretKey: process.env.SECRET || "secret",
      }
    );

    await this.tokenModel.updateOne(
      { _id: userToken._id },
      {
        $set: {
          token: newToken,
          expireAt: this.appService.setTime(180),
          createdAt: this.appService.setTime(0),
        },
      }
    );

    return {
      token: newToken,
    };
  }

  async logout(_id: mongoose.Types.ObjectId): Promise<void> {
    if (!_id) throw new HttpException("Возникла непредвиденная ошибка", HttpStatus.BAD_REQUEST);
    await this.tokenModel.deleteOne({ _id });
  }

  private generateToken(userId: UserId, { expire, secretKey }: Options): string {
    return this.jwtService.sign({ _id: userId._id }, { expiresIn: expire, secret: secretKey });
  }

  private userIdDecoder(token: string | undefined): string {
    if (!token) return "";
    let decodedId: any = "";
    if (token.split(" ").length === 1) {
      decodedId = token.split(".")[1];
    } else {
      decodedId = token.split(" ")[1].split(".")[1];
    }
    decodedId = Buffer.from(decodedId, "base64").toString("binary");
    return JSON.parse(decodedId)._id;
  }
}
