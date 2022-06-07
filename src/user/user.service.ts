import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ContactsDto } from "src/Models/dto/Contacts.dto";
import { User } from "src/Models/User.schema";
import { UserResponse } from "src/responses/UserResponses";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

  async getUser(_id: Types.ObjectId): Promise<UserResponse> {
    return await this.userModel.findById({ _id });
  }

  async addContacts(_id: Types.ObjectId, contacts: ContactsDto): Promise<UserResponse> {
    const user = await this.userModel.findById({ _id })
    if (Object.values(contacts).every(el => !el)) throw new HttpException("Неверно переданы значения", HttpStatus.BAD_REQUEST)
    const newContacts = user.contacts;
    Object.keys(contacts).forEach(key => {
      if (contacts[key]) {
        newContacts[key] = contacts[key]
      }
    })
    console.log('dasdfawfa', newContacts);
    await this.userModel.updateOne(
      { _id },
      {
        $set: {
          contacts: {...newContacts}
        }
      },
      {
        new: true
      }
    )
    return user;
  }
}
