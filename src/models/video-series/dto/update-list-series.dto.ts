import { IsArray, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UpdateVideoSeriesDto } from "@models/video-series/dto/update-video-series.dto";

export class UpdateListSeriesDto {

  @ApiProperty({ example: "1", description: "VideoId" })
  @IsNumber({}, { message: "Is not number." })
  videoId: number;

  @ApiProperty({ example: "1", description: "SeasonId" })
  @IsNumber({}, { message: "Is not number." })
  @IsOptional()
  seasonId: number;

  @ApiProperty({
    type: [UpdateVideoSeriesDto],
    description: "VideoId"
  })
  @IsArray()
  readonly series: UpdateVideoSeriesDto[];
}
