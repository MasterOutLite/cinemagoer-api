import { CreateVideoInfoDto } from "@models/video-info/dto/create-video-info.dto";
import { CreateVideoSeriesDto } from "@models/video-series/dto/create-video-series.dto";
import { CreateVideoDto } from "@models/video/dto/create-video.dto";
import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateVideoCombineDto extends IntersectionType(
  CreateVideoDto,
  CreateVideoInfoDto
) {
  @ApiProperty({ type: [CreateVideoSeriesDto], description: "Create series", required: false })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      const json = JSON.parse(value);
      console.log("Json.Parse", json);
      if (Array.isArray(json)) {
        return json;
      } else {
        return [json];
      }
    }
    return value.map(jsonString => JSON.parse(jsonString));
  })
  series?: CreateVideoSeriesDto[];
}
