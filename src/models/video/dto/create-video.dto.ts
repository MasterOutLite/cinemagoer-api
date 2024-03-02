import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNumberString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { VideoCategory } from "@models/video/enum/video-category";
import { SeasonOfYear } from "@models/video/enum/season-of-year";
import { VideoStatus } from "@models/video/enum/video-status";
import { VideoType } from "@models/video/enum/video-type";

export class CreateVideoDto {
  @IsArray({ message: "Is not array" })
  @ApiProperty({
    description: "Name video.",
    example: ["Wolf", "Вовк"]
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  name: string[];

  @ApiProperty({ example: "Icon file", description: "Icon file (png, jpeg).", format: "binary", required: false })
  icon?: string;

  @ApiProperty({ example: "2023-9-23", description: "Date release", format: "date" })
  @IsDate({ message: "Is not date" })
  @Transform(({ value }) => (new Date(value)))
  dateRelease: Date;

  @ApiProperty({ example: [1, 6, 7], type: [Number], description: "Genre (Roman, Fight, ...)." })
  @IsArray({ message: "Is not arr" })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  genreIds: number[];

  @ApiProperty({ enum: VideoType, enumName: "VideoType", description: "Type video (Film, Serial, ...)." })
  @IsEnum(VideoType)
  type: VideoType;

  @ApiProperty({
    enum: SeasonOfYear,
    enumName: "SeasonOfYear",
    description: "Season of year (Winter, Spring, Summer, Autumn)."
  })
  @IsEnum(SeasonOfYear)
  seasonOfYear: SeasonOfYear;

  @ApiProperty({ enum: VideoStatus, enumName: "VideoStatus", description: "Status video (Release, Waiting, ...)." })
  @IsEnum(VideoStatus)
  status: VideoStatus;

  @ApiProperty({
    enum: VideoCategory,
    description: "Video category (Film, Cartoon, ...)."
  })
  @IsEnum(VideoCategory)
  videoCategory: VideoCategory;

  @ApiProperty({ example: "1", description: "Publisher name (The Walt Disney Company, Pixar, ...)." })
  @IsNumberString({}, { message: "Is not number" })
  publisherId: number;

  @ApiProperty({ example: "1", description: "Age rating (18+, 16+, PG-13, ...)." })
  @IsNumberString({}, { message: "Is not number" })
  ageRatingId: number;

  @ApiProperty({ example: "1", description: "Group relation", required: false })
  @IsNumberString({}, { message: "Is not number" })
  @IsOptional()
  groupId?: number;
}
