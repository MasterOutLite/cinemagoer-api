import { ApiProperty } from "@nestjs/swagger";
import Video from "@models/video/video.entity";

export class ResponseCountVideoDto {

  constructor(count: number, page: number, rows: Video[]) {
    this.page = page;
    this.count = count;
    this.rows = rows;
  }

  @ApiProperty({ example: 1, description: "Count" })
  count: number;

  @ApiProperty({ example: 1, description: "Page" })
  page: number;

  @ApiProperty({
    type: [Video], description: "Video arr"
  })
  readonly rows: Video[];

}
