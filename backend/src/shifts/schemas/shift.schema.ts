import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ShiftDocument = HydratedDocument<Shift>;

export enum ShiftStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Shift {
  @Prop({
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  })
  id: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  department: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ trim: true })
  description: string;

  @Prop({
    type: String,
    default: null,
    index: true,
  })
  employeeId: string | null;

  @Prop({
    required: true,
    enum: ShiftStatus,
    default: ShiftStatus.DRAFT,
  })
  status: ShiftStatus;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);
