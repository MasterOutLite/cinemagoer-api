import { ApiProperty } from "@nestjs/swagger";
import Video from "@models/video/video.entity";
import VideoInfo from "@models/video-info/video-info.entity";

export class ResponseVideo {
  @ApiProperty({ description: "Response video" })
  video: Video;

  @ApiProperty({ description: "Response video info" })
  videoInfo: VideoInfo;
}
