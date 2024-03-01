import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNumberString, IsString } from "class-validator";
import { DayOfWeek } from "@models/video-series/day-of-week";

export class CreateVideoSeriesDto {
  @ApiProperty({ example: "1", description: "Number series." })
  @IsNumberString({}, { message: "Is not number." })
  readonly series: number;

  @ApiProperty({ enum: DayOfWeek, description: "Day when be show series." })
  @IsNumberString({}, { message: "Is not number." })
  readonly dayOfWeek: DayOfWeek;

  @ApiProperty({ example: "Again hi!", description: "Name series." })
  @IsString({ message: "Is not string." })
  readonly name: string;

  @ApiProperty({ example: "2023-09-09", description: "Data release.", format: "Date" })
  @IsDate({ message: "Is not date." })
  readonly dateRelease: Date;

  @ApiProperty({ example: "false", description: "Release: yes or no." })
  @IsBoolean({ message: "Is not bool." })
  readonly release: boolean;
}
