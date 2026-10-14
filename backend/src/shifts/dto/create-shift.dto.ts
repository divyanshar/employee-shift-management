import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMilitaryTime,
} from 'class-validator';

export class CreateShiftDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsDateString({strict:true})
  date: string;

  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime({ message: 'startTime must be a valid 24-hour time string (HH:MM)' })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @IsMilitaryTime({ message: 'startTime must be a valid 24-hour time string (HH:MM)' })
  endTime: string;

  @IsOptional()
  @IsString()
  description: string;
}