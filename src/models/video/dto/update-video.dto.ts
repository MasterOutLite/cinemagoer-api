import { VideoCategory } from './../enum/video-category';
import { VideoStatus } from './../enum/video-status';
import { VideoType } from './../enum/video-type';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SeasonOfYear } from '@models/video/enum/season-of-year';

export class UpdateVideoDto {
  @IsArray({ message: 'Is not array' })
  @ApiProperty({
    description: 'Name video.',
    required: false,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsOptional()
  name?: string[];

  @ApiProperty({
    description: 'Name video.',
    required: false,
  })
  @IsOptional()
  nameMain?: string;

  @ApiProperty({
    description: 'Icon file (png, jpeg).',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Date release',
    format: 'date',
    required: false,
  })
  @IsDate({ message: 'Is not date' })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dateRelease?: Date;

  @ApiProperty({
    enum: SeasonOfYear,
    description: 'Season of year (Winter, Spring, Summer, Autumn).',
    required: false,
  })
  @IsEnum(SeasonOfYear)
  @IsOptional()
  seasonOfYear?: SeasonOfYear;

  @ApiProperty({
    type: [Number],
    description: 'Genre (Roman, Fight, ...).',
    required: false,
  })
  @IsArray({ message: 'Is not arr' })
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsOptional()
  genreIds?: number[];

  @ApiProperty({
    enum: VideoType,
    description: 'Type video (Film, Serial, ...).',
    required: false,
  })
  @IsEnum(VideoType)
  @IsOptional()
  type?: VideoType;

  @ApiProperty({
    enum: VideoStatus,
    description: 'Status video (Release, Waiting, ...).',
    required: false,
  })
  @IsEnum(VideoStatus)
  @IsOptional()
  status?: VideoStatus;

  @ApiProperty({
    enum: VideoCategory,
    description: 'Video category (Film, Cartoon, ...).',
    required: false,
  })
  @IsEnum(VideoCategory)
  @IsOptional()
  videoCategory: VideoCategory;

  @ApiProperty({
    description: 'Publisher name (The Walt Disney Company, Pixar, ...).',
    required: false,
  })
  @IsNumberString({}, { message: 'Is not number' })
  @IsOptional()
  publisherId?: number;

  @ApiProperty({
    description: 'Age rating (18+, 16+, PG-13, ...).',
    required: false,
  })
  @IsNumberString({}, { message: 'Is not number' })
  @IsOptional()
  ageRatingId?: number;

  @ApiProperty({ description: 'Group relation', required: false })
  @IsNumberString({}, { message: 'Is not number' })
  @IsOptional()
  groupId?: number;
}
