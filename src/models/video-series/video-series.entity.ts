import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Video from "@models/video/video.entity";
import Season from "@models/season/season.entity";
import { ApiProperty } from "@nestjs/swagger";
import { DayOfWeek } from "@models/video-series/day-of-week";

@Entity({ name: "video-series" })
class VideoSeries {
  @ApiProperty({ example: 1, description: "ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Video, video => video.videoSeries)
  video: Video;
  @ApiProperty({ example: 1, description: "VideoID" })
  @Column()
  videoId: number;

  @ApiProperty({ example: 1, description: "Series" })
  @Column()
  series: number;

  @ApiProperty({ example: "Name series", description: "Name" })
  @Column()
  name: string;

  @ApiProperty({ example: new Date(), description: "Data release" })
  @Column()
  dateRelease: Date;

  @ApiProperty({ example: true, description: "Release" })
  @Column({ default: false })
  release: boolean;

  @ManyToOne(() => Season, season => season.videoSeries)
  season: Season;
  @ApiProperty({ example: 1, description: "season " })
  @Column({ nullable: true })
  seasonId: number;

  @ApiProperty({ enum: DayOfWeek, description: "DayOfWeek" })
  @Column({ nullable: true })
  dayOfWeek: DayOfWeek;

}

export default VideoSeries;
