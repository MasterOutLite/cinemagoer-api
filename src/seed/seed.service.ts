import { Injectable } from "@nestjs/common";
import { roles } from "@src/const/role";
import { ageRatings } from "@src/const/age-ratings";
import { publishers } from "@src/const/publishers";
import { genres } from "@src/const/genre";
import { admins, users } from "@src/const/user";
import { anime, movie, serials } from "@src/const/video";
import { FilesService } from "@src/files/files.service";
import { AuthService } from "@src/auth/auth.service";
import { faker } from "@faker-js/faker/locale/uk";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Role from "@models/role/role.entity";
import AgeRating from "@models/age-rating/age-rating.entity";
import Publisher from "@models/publisher/publisher.entity";
import Genre from "@models/genre/genre.entity";
import Comments from "@models/comments/comments.entity";
import CommentsRate from "@models/comments-rate/comments-rate.entity";
import VideoRate from "@models/video-rate/video-rate.entity";
import { UsersService } from "@models/users/users.service";
import { VideoService } from "@models/video/video.service";
import { VideoSeriesService } from "@models/video-series/video-series.service";

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private role: Repository<Role>,
    @InjectRepository(AgeRating)
    private ageRating: Repository<AgeRating>,
    @InjectRepository(Publisher)
    private publisher: Repository<Publisher>,
    @InjectRepository(Genre)
    private genre: Repository<Genre>,
    @InjectRepository(Comments)
    private comments: Repository<Comments>,
    @InjectRepository(CommentsRate)
    private commentsRate: Repository<CommentsRate>,
    @InjectRepository(VideoRate)
    private videoRate: Repository<CommentsRate>,
    private usersService: UsersService,
    private authService: AuthService,
    private filesService: FilesService,
    private videoService: VideoService,
    private videoSeriesService: VideoSeriesService
  ) {
  }

  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //region create seed
  async createSeed() {
    console.log("Seed:", "Start seeding");
    await this.createSeedRole();
    await this.createSeedAgeRating();
    await this.createSeedPublisher();
    await this.createSeedGenre();
    await this.createSeedUser();
    await this.createSeedVideo();
    console.log("Seed:", "End seeding");
  }

  async upsertSeed() {
    console.log("Seed:", "Start seeding");
    await this.upsertSeedRole();
    await this.upsertSeedAgeRating();
    await this.upsertSeedPublisher();
    await this.upsertSeedGenre();
    console.log("Seed:", "End seeding");
  }

  //endregion


  // TODO: Role
  // region Role

  async createSeedRole() {
    await this.role.save(roles);
  }

  async upsertSeedRole() {
    // for (const role of roles) {
    //     await this.role.upsert(role);
    // }
  }

  //endregion

  // TODO: ageRating
  //region AgeRating
  async createSeedAgeRating() {
    await this.ageRating.save(ageRatings);
  }

  async upsertSeedAgeRating() {
    // for (const ageRating of ageRatings) {
    //     await this.ageRating.upsert(ageRating);
    // }
  }

  //endregion

  //region Publisher
  async createSeedPublisher() {
    await this.publisher.save(publishers);
  }

  async upsertSeedPublisher() {
    // for (const publisher of publishers) {
    //     await this.publisher.upsert(publisher);
    // }
  }

  //endregion

  //region Genre
  async createSeedGenre() {
    await this.genre.save(genres);
  }

  async upsertSeedGenre() {
    // for (const genre of genres) {
    //     await this.genre.upsert(genre);
    // }
  }

  //endregion


  //region User and Admin
  async createSeedUser() {

    for (const admin of admins) {
      await this.authService.registration(admin, true);
    }

    for (const user of users) {
      await this.authService.registration(user, false);
    }

    const countUserCreate = 40;
    for (let i = 0; i < countUserCreate; i++) {
      await this.authService.registration({
        email: faker.internet.email(),
        nickname: faker.internet.userName(),
        password: faker.internet.password()
      }, false);
    }
  }

  //endregion

  async createSeedVideo() {
    const arr = [anime, movie, serials];
    const users = await this.usersService.getUserAll();

    for (const arrElement of arr) {
      for (const video of arrElement) {
        // create video
        const entity = await this.videoService.createSeed(video);
        //create series when its exists
        if (video.series) {
          await this.videoSeriesService.create({ videoId: entity.video.id, series: video.series.series });
        }

        // Create video rate
        const countRateVideo = this.getRndInteger(5, users.length);
        const rateDate = [];
        for (let i = 0; i < countRateVideo; i++) {
          const randomUser = Math.floor(Math.random() * users.length);
          const user = users[randomUser];
          rateDate.push({
            videoId: entity.video.id,
            rate: this.getRndInteger(1, 10),
            userId: user.id
          });
        }
        await this.videoRate.save(rateDate);

        // create random count comments to video
        // For more count comment edit here
        const countComments = this.getRndInteger(5, 15);
        const commentsData = [];
        for (let i = 0; i < countComments; i++) {
          const randomUser = Math.floor(Math.random() * users.length);
          const user = users[randomUser];
          commentsData.push({
            userId: user.id,
            videoId: entity.video.id,
            createAt: new Date(),
            // For more count words in comment edit here
            comment: faker.word.words({ count: { min: 10, max: 30 } })
          });
        }
        const comments = await this.comments.save(commentsData);

        // create random comments rate
        const commentsRateData = [];
        for (const comment of comments) {
          // For more count rate edit here
          const randomCommentsRate = Math.floor(Math.random() * 8);
          for (let j = 0; j < randomCommentsRate; j++) {
            const randomUser = Math.floor(Math.random() * users.length);
            const user = users[randomUser];
            const rate = Math.floor(Math.random() * 2);
            commentsRateData.push({
              rate: rate === 1,
              userId: user.id,
              commentsId: comment.id
            });
          }
        }
        await this.commentsRate.save(commentsRateData);
      }
    }
  }


}
