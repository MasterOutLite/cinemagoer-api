import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Publisher from "@models/publisher/publisher.entity";
import AgeRating from "@models/age-rating/age-rating.entity";
import ListView from "@models/list-view/list-view.entity";
import VideoRate from "@models/video-rate/video-rate.entity";
import Comments from "@models/comments/comments.entity";
import VideoInfo from "@models/video-info/video-info.entity";
import VideoSeries from "@models/video-series/video-series.entity";
import Season from "@models/season/season.entity";
import Genre from "@models/genre/genre.entity";
import Group from "@models/group/group.entity";
import { VideoCategory } from "@models/video/enum/video-category";
import { VideoStatus } from "@models/video/enum/video-status";
import { VideoType } from "@models/video/enum/video-type";
import { ApiProperty } from "@nestjs/swagger";
import { SeasonOfYear } from "@models/video/enum/season-of-year";


@Entity({ name: "videos" })
class Video {
  @ApiProperty({ example: 1, description: "ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: ["First name", "Second name"], description: "Video namas" })
  @Column({ type: "simple-array" })
  name: string[];

  @ApiProperty({ example: new Date(), description: "Data release" })
  @Column()
  dateRelease: Date;

  @ApiProperty({ example: "icon/ghp.png", description: "Icon url" })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({ example: 1, description: "Type video" })
  @Column()
  type: VideoType;

  @ApiProperty({ example: 1, description: "Status video" })
  @Column()
  status: VideoStatus;

  @ApiProperty({ example: 1, description: "Category video" })
  @Column()
  videoCategory: VideoCategory;


  @ApiProperty({ type: Publisher, description: "Publisher" })
  @ManyToOne(() => Publisher, publisher => publisher.video)
  publisher: Publisher;
  @ApiProperty({ example: 1, description: "Publisher" })
  @Column()
  publisherId: number;

  @ApiProperty({ type: AgeRating, description: "Age rating to view" })
  @ManyToOne(() => AgeRating, age => age.video)
  ageRating: AgeRating;
  @ApiProperty({ example: 1, description: "Age rating to view" })
  @Column()
  ageRatingId: number;

  @ApiProperty({ example: 1, description: "SeasonOfYear" })
  @Column()
  seasonOfYear: SeasonOfYear;

  @OneToMany(() => ListView, view => view.video)
  listView: ListView[];

  @OneToMany(() => VideoRate, rate => rate.video)
  videoRate: VideoRate[];

  @OneToMany(() => Comments, comments => comments.video)
  comments: Comments[];

  @OneToMany(() => VideoInfo, videoInfo => videoInfo.video)
  videoInfo: VideoInfo[];

  @OneToMany(() => VideoSeries, series => series.video)
  videoSeries: VideoSeries[];

  @OneToMany(() => Season, season => season.video)
  season: Season[];

  @ManyToMany(() => Genre, genre => genre.video)
  @JoinTable({ name: "video-genre" })
  genre: Genre[];

  @ManyToMany(() => Group, group => group.videos)
  @JoinTable({ name: "group-video" })
  group: Group[];
}


export default Video;
