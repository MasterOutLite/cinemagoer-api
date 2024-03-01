import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsOptional, IsString } from "class-validator";
import { VideoCategory } from "@models/video/enum/video-category";

export class SearchVideoQuery {

  @ApiProperty({ example: "Wo", description: "String what will be search." })
  @IsString()
  readonly name: string;

  @ApiProperty({ enum: VideoCategory, description: "String what will be search." })
  @IsNumberString()
  readonly videoCategory: VideoCategory;

  @ApiProperty({ example: 1, description: "Page" })
  readonly page: number;

  @ApiProperty({ example: 10, description: "Limit", required: false })
  @IsNumberString()
  @IsOptional()
  readonly limit?: number;
}
