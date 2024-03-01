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
import { VideoCategory } from "@models/video/video-category";
import { VideoStatus } from "@models/video/video-status";
import { VideoType } from "@models/video/video-type";


@Entity({ name: "videos" })
class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "simple-array" })
  name: string[];

  @Column()
  dateRelease: Date;

  @Column({ nullable: true })
  icon: string;

  @Column()
  type: VideoType;

  @Column()
  status: VideoStatus;

  @Column()
  videoCategory: VideoCategory;

  @ManyToOne(() => Publisher, publisher => publisher.video)
  publisher: Publisher;
  @Column()
  publisherId: number;

  @ManyToOne(() => AgeRating, age => age.video)
  ageRating: AgeRating;
  @Column()
  ageRatingId: number;

  @Column()
  seasonOfYear: number;

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
