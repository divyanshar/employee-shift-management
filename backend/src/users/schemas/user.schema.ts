import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    default: uuidv4,
    unique: true,
    index: true,
  })
  id: string;

  @Prop({
    required: true,
    trim: true,
    lowercase:true
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.EMPLOYEE,
  })
  role: Role;
}

export const UserSchema =
  SchemaFactory.createForClass(User);