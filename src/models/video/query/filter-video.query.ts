import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsNumberString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { SeasonOfYear } from "@models/video/enum/season-of-year";
import { VideoType } from "@models/video/enum/video-type";
import { VideoStatus } from "@models/video/enum/video-status";
import { VideoCategory } from "@models/video/enum/video-category";

export class FilterVideoQuery {

  @ApiProperty({ example: 1, description: "Page", required: true })
  @IsNumberString()
  page: number;

  @ApiProperty({ example: 10, description: "Limit", required: false })
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiProperty({ example: "2023-9-23", description: "Date release min", format: "date", required: false })
  @IsDate({ message: "Is not date" })
  @Transform(({ value }) => (new Date(value)))
  @IsOptional()
  dateReleaseMin: Date;

  @ApiProperty({ example: "2023-12-23", description: "Date release max", format: "date", required: false })
  @IsDate({ message: "Is not date" })
  @Transform(({ value }) => (new Date(value)))
  @IsOptional()
  dateReleaseMax: Date;

  @ApiProperty({ enum: SeasonOfYear, description: "Season of year (Winter, Spring, Summer, Autumn).", required: false })
  @IsEnum(SeasonOfYear)
  @IsOptional()
  seasonOfYear?: SeasonOfYear;

  @ApiProperty({ example: [1, 6, 7], type: [Number], description: "Genre (Roman, Fight, ...).", required: false })
  @IsArray({ message: "Is not arr" })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(",")))
  genreIds: number[];

  @ApiProperty({ enum: VideoType, description: "Type video (Film, Serial, ...).", required: false })
  @IsEnum(VideoType)
  @IsOptional()
  type: VideoType;

  @ApiProperty({ enum: VideoStatus, description: "Status video (Release, Waiting, ...).", required: false })
  @IsEnum(VideoStatus)
  @IsOptional()
  status: VideoStatus;

  @ApiProperty({ enum: VideoCategory, description: "Video category (Film, Cartoon, ...).", required: false })
  @IsEnum(VideoCategory)
  @IsOptional()
  videoCategory: VideoCategory;

  @ApiProperty({ example: "1", description: "Publisher name (The Walt Disney Company, Pixar, ...).", required: false })
  @IsNumberString({}, { message: "Is not number" })
  @IsOptional()
  publisherId: number;

  @ApiProperty({ example: "1", description: "Age rating (18+, 16+, PG-13, ...).", required: false })
  @IsNumberString({}, { message: "Is not number" })
  @IsOptional()
  ageRatingId: number;
}
