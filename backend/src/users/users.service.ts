import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role, User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({email});
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({
        id,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserDocument> {
    try {
      const user = new this.userModel(userData);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async findEmployees() {
  return await this.userModel.find({ role: Role.EMPLOYEE });
}
async deleteEmployee(id:string){
  return await this.userModel.findOneAndDelete({id});
}
}
