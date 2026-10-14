import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLeaveDto {
  @IsDateString({strict:true})
  startDate: string;

  @IsDateString({strict:true})
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
