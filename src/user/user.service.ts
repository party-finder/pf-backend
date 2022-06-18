import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AppService } from "src/app.service";
import { ContactsDto } from "src/Models/dto/Contacts.dto";
import { User } from "src/Models/User.schema";
import { UserResponse } from "src/responses/UserResponses";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private appService: AppService
  ) { }

  async getUser(_id: Types.ObjectId): Promise<UserResponse> {
    const user = this.userModel.findByIdAndUpdate(
      { _id },
      {
        lastOnline: this.appService.setTime(0)
      },
      {
        new: true
      }
    )
    return user
  }

  async addContacts(_id: Types.ObjectId, contacts: ContactsDto): Promise<UserResponse> {
    const user = await this.userModel.findByIdAndUpdate(
      { _id },
      {
        $set: {
          contacts
        }
      },
      {
        new: true
      }
    )
    return user;
  }
}
