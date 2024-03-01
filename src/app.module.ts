import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { CommandSeed } from "@src/command-seed";
import { CommandModule } from "nestjs-command";
import { UsersModule } from "@models/users/users.module";
import { RoleModule } from "@models/role/role.module";
import { UserListViewModule } from "@models/user-list-view/user-list-view.module";
import { CommentsModule } from "@models/comments/comments.module";
import { PublisherModule } from "@models/publisher/publisher.module";
import { AgeRatingModule } from "@models/age-rating/age-rating.module";
import { GenreModule } from "@models/genre/genre.module";
import { ListViewModule } from "@models/list-view/list-view.module";
import { VideoModule } from "@models/video/video.module";
import { VideoRateModule } from "@models/video-rate/video-rate.module";
import { CommentsRateModule } from "@models/comments-rate/comments-rate.module";
import { VideoInfoModule } from "@models/video-info/video-info.module";
import { VideoSeriesModule } from "@models/video-series/video-series.module";
import { GroupModule } from "@models/group/group.module";
import { SeasonModule } from "@models/season/season.module";
import { FilesModule } from "@src/files/files.module";
import { AuthModule } from "@src/auth/auth.module";
import { SeedModule } from "@src/seed/seed.module";
import User from "@models/users/users.entity";
import Video from "@models/video/video.entity";
import Role from "@models/role/role.entity";
import UserListView from "@models/user-list-view/user-list-view.entity";
import ListView from "@models/list-view/list-view.entity";
import Season from "@models/season/season.entity";
import CommentsRate from "@models/comments-rate/comments-rate.entity";
import Group from "@models/group/group.entity";
import VideoInfo from "@models/video-info/video-info.entity";
import VideoSeries from "@models/video-series/video-series.entity";
import Comments from "@models/comments/comments.entity";
import Publisher from "@models/publisher/publisher.entity";
import VideoRate from "@models/video-rate/video-rate.entity";
import AgeRating from "@models/age-rating/age-rating.entity";
import Genre from "@models/genre/genre.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    CommandModule,
    //for productive
    //ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static'),}),
    //for development
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, "..", "static") }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Video, Role, UserListView, ListView,
        Publisher, AgeRating, Genre,
        VideoRate, VideoInfo, VideoSeries, Comments, CommentsRate, Season,
        Group
      ],
      autoLoadEntities: false,
      synchronize: true
    }),
    UsersModule,
    RoleModule,
    UserListViewModule,
    CommentsModule,
    PublisherModule,
    AgeRatingModule,
    GenreModule,
    ListViewModule,
    VideoModule,
    VideoRateModule,
    CommentsRateModule,
    VideoInfoModule,
    VideoSeriesModule,
    GroupModule,
    SeasonModule,
    FilesModule,
    AuthModule,
    SeedModule
  ],
  controllers: [],
  providers: [CommandSeed]
})
export class AppModule {
}
