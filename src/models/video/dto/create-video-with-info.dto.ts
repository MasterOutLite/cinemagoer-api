import { IsArray, IsDate, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { VideoType } from "@models/video/enum/video-type";
import { SeasonOfYear } from "@models/video/enum/season-of-year";
import { VideoStatus } from "@models/video/enum/video-status";
import { VideoCategory } from "@models/video/enum/video-category";

export class CreateVideoWithInfoDto {
  @IsArray({ message: "Is not array" })
  @ApiProperty({
    description: "Name video.",
    example: ["Wolf", "Вовк"]
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  name: string[];

  @ApiProperty({ example: "Icon file",  description: "Icon file (png, jpeg).", format: "binary", required: false })
  icon?: string;

  @ApiProperty({ example: "2023-9-23", description: "Date release", format: "date" })
  @IsDate({ message: "Is not date" })
  @Transform(({ value }) => (new Date(value)))
  dateRelease: Date;

  @ApiProperty({ example: [1, 6, 7], type: [Number], description: "Genre " })
  @IsArray({ message: "Is not arr" })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  genreIds: number[];

  @ApiProperty({ enum: VideoType, enumName: "VideoType", description: "Type video " })
  @IsEnum(VideoType)
  type: VideoType;

  @ApiProperty({
    enum: SeasonOfYear,
    enumName: "SeasonOfYear",
    description: "Season of year "
  })
  @IsEnum(SeasonOfYear)
  seasonOfYear: SeasonOfYear;

  @ApiProperty({ enum: VideoStatus, enumName: "VideoStatus", description: "Status video" })
  @IsEnum(VideoStatus)
  status: VideoStatus;

  @ApiProperty({
    enum: VideoCategory,
    description: "Video category"
  })
  @IsEnum(VideoCategory)
  videoCategory: VideoCategory;

  @ApiProperty({ example: "1", description: "Publisher name " })
  @IsNumberString({}, { message: "Is not number" })
  publisherId: number;

  @ApiProperty({ example: "1", description: "Age rating" })
  @IsNumberString({}, { message: "Is not number" })
  ageRatingId: number;

  @ApiProperty({ example: "1", description: "Group relation", required: false })
  @IsNumberString({}, { message: "Is not number" })
  @IsOptional()
  groupId?: number;


  // Info

  @ApiProperty({ example: "Its video is ...", description: "Description" })
  @IsString()
  description: string;

  @ApiProperty({ example: ["Loid", "Goru"], description: "Main Characters" })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  mainCharacters?: string[];

  @ApiProperty({ description: "Trailers files", format: "binary", required: false })
  trailers?: string[];

  @ApiProperty({ example: "12", description: "Count series" })
  @IsNumberString({}, { message: "Is not number" })
  @IsOptional()
  countSeries?: number;

  @ApiProperty({ description: "Pictures files", format: "binary", required: false })
  pictures?: string[];

  @ApiProperty({ example: "~23m", description: "Duration one video" })
  @IsString()
  @IsOptional()
  duration?: string;
}
