import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Video from "@models/video/video.entity";
import User from "@models/users/users.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "video-rate" })
class VideoRate {
  @ApiProperty({ example: 1, description: "Id" })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Video, video => video.videoRate)
  video: Video;
  @Column()
  @ApiProperty({ example: 1, description: "VideoId" })
  videoId: number;

  @ManyToOne(() => User, user => user.videoRate)
  user: User;
  @ApiProperty({ example: 1, description: "UserId" })
  @Column()
  userId: number;

  @ApiProperty({ example: 10, description: "Rate" })
  @Column()
  rate: number;
}

export default VideoRate;
