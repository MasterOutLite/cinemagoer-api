import { ApiProperty } from "@nestjs/swagger";
import { ResponseVideoSeriesDto } from "@models/video-series/dto/response-video-series.dto";
import { ResponseSeasonDto } from "@models/season/dto/response-season.dto";
import { CreateVideoSeriesDto } from "@models/video-series/dto/create-video-series.dto";
import { CreateSeasonDto } from "@models/season/dto/create-season.dto";
import VideoInfo from "@models/video-info/video-info.entity";
import Video from "@models/video/video.entity";

export class ResponseVideoCombineDto {
  constructor(video: Video, videoInfo: VideoInfo,
              series?: ResponseVideoSeriesDto[], season?: ResponseSeasonDto[]) {
    this.video = video;
    this.videoInfo = videoInfo;
    this.series = series;
    this.season = season;
  }

  @ApiProperty({ description: "Response video" })
  video: Video;

  @ApiProperty({ description: "Response video info" })
  videoInfo: VideoInfo;

  @ApiProperty({ type: [CreateVideoSeriesDto], description: "Response video series", required: false })
  series?: ResponseVideoSeriesDto[];

  @ApiProperty({ type: [CreateSeasonDto], description: "Response video Season", required: false })
  season?: ResponseSeasonDto[];
}
