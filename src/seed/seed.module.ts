import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { AuthModule } from "@src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "@models/users/users.entity";
import Video from "@models/video/video.entity";
import Role from "@models/role/role.entity";
import UserListView from "@models/user-list-view/user-list-view.entity";
import ListView from "@src/models/list-view/list-view.entity";
import Season from "@models/season/season.entity";
import { VideoSeriesModule } from "@models/video-series/video-series.module";
import { VideoModule } from "@models/video/video.module";
import { FilesModule } from "@src/files/files.module";
import { UsersModule } from "@models/users/users.module";
import Group from "@models/group/group.entity";
import Comments from "@models/comments/comments.entity";
import CommentsRate from "@models/comments-rate/comments-rate.entity";
import VideoSeries from "@models/video-series/video-series.entity";
import VideoInfo from "@models/video-info/video-info.entity";
import VideoRate from "@models/video-rate/video-rate.entity";
import Publisher from "@models/publisher/publisher.entity";
import AgeRating from "@models/age-rating/age-rating.entity";
import Genre from "@models/genre/genre.entity";


@Module({
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([User, Video, Role, UserListView, ListView,
      Publisher, AgeRating, Genre,
      VideoRate, VideoInfo, VideoSeries, Comments, CommentsRate, Season,
      Group]),
    UsersModule, FilesModule, VideoModule, AuthModule, JwtModule, VideoSeriesModule
  ],
  exports: [SeedService]
})
export class SeedModule {
}
