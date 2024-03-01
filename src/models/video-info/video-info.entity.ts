import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Video from "@models/video/video.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "video-info" })
class VideoInfo {

  @ApiProperty({ example: 1, description: "Id" })
  @PrimaryGeneratedColumn()
  id: number;


  @ManyToOne(() => Video, video => video.videoInfo)
  video: Video;
  @Column({ unique: true })
  videoId: number;

  @ApiProperty({ example: "Any text about video", description: "Description video" })
  @Column({ type: "text", nullable: true })
  description: string;

  @ApiProperty({ example: 1, description: "Main character" })
  @Column({ type: "simple-array", nullable: true })
  mainCharacters: string[];

  @ApiProperty({ example: ["first url", "second url"], description: "Trailers url" })
  @Column({ nullable: true, type: "simple-array" })
  trailers: string[];

  @ApiProperty({ example: "12", description: "Count series" })
  @Column({ nullable: true })
  countSeries: number;

  @ApiProperty({ example: ["first url", "second url"], description: "Pictures url" })
  @Column({ nullable: true, type: "simple-array" })
  pictures: string[];

  @ApiProperty({ example: "~23m", description: "Duration one video" })
  @Column({ nullable: true })
  duration: string;
}

export default VideoInfo;
