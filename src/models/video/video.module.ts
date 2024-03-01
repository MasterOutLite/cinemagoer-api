import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Video from "@models/video/video.entity";
import { AuthModule } from "@src/auth/auth.module";
import { VideoRateModule } from "@models/video-rate/video-rate.module";
import { FilesModule } from "@src/files/files.module";
import { VideoInfoModule } from "@models/video-info/video-info.module";
import { PublisherModule } from "@models/publisher/publisher.module";
import { GenreModule } from "@models/genre/genre.module";
import { SeasonModule } from "@models/season/season.module";
import { AgeRatingModule } from "@models/age-rating/age-rating.module";
import { GroupModule } from "@models/group/group.module";
import { ListViewModule } from "@models/list-view/list-view.module";
import Genre from "@models/genre/genre.entity";
import Publisher from "@models/publisher/publisher.entity";
import AgeRating from "@models/age-rating/age-rating.entity";
import Group from "@models/group/group.entity";
import VideoRate from "@models/video-rate/video-rate.entity";

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [
    TypeOrmModule.forFeature([Video, VideoRate,
      Genre, Publisher, AgeRating, Group]),
    AuthModule,
    VideoRateModule,
    FilesModule, VideoInfoModule,
    SeasonModule,
    GenreModule, PublisherModule,
    AgeRatingModule, GroupModule, ListViewModule
  ],
  exports: [
    VideoService
  ]
})
export class VideoModule {
}
