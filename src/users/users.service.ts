import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ObjId } from 'src/common/types/obj-id.type';
import { UserDocument, UserModel } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>
  ) {}

  async createOne(user: Partial<UserDocument>): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async findOneById(userId: ObjId): Promise<UserDocument> {
    userId = new Types.ObjectId(userId);
    return this.userModel.findById(userId);
  }

  async findOneByIdOrFail(userId: ObjId): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel.findById(userId);
    if (!foundUser) {
      const errorMessage: string = 'User with _id: ' + userId + ' is not found!' ;
      throw new NotFoundException(errorMessage);
    }
    return foundUser;
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async findOneByEmailOrFail(email: string): Promise<UserDocument> {
    const foundUser: UserDocument = await this.userModel.findOne({ email });
    if (!foundUser) {
      const errorMessage: string = 'User with email: ' + email + ' is not found!' ;
      throw new NotFoundException(errorMessage);
    }
    return foundUser;
  }

}
