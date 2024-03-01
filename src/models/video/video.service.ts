import { BadRequestException, Injectable } from "@nestjs/common";
import Video from "@models/video/video.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, ILike, In, Repository } from "typeorm";
import { FilesService, TypeFile } from "@src/files/files.service";
import { TokenFormat } from "@src/auth/dto/TokenFormat";
import { CreateVideoCombineDto } from "@models/video/dto/create-video-combine.dto";
import { CreateVideoDto } from "./dto/create-video.dto";
import { ResponseVideoCombineDto } from "@models/video/dto/response-video-combine.dto";
import Genre from "@models/genre/genre.entity";
import Group from "@models/group/group.entity";
import { CreateVideoInfoDto } from "@models/video-info/dto/create-video-info.dto";
import { UpdateVideoDto } from "@models/video/dto/update-video.dto";
import Publisher from "@models/publisher/publisher.entity";
import AgeRating from "@models/age-rating/age-rating.entity";
import { VideoInfoService } from "@models/video-info/video-info.service";
import { FilterVideoQuery } from "@models/video/query/filter-video.query";
import { ResponseCountVideoDto } from "@models/video/dto/response-count-video.dto";
import { SearchVideoQuery } from "@models/video/query/search-video.query";
import { GetVideoQuery } from "@models/video/query/get-video.query";
import { ResponseVideoSeriesDto } from "@models/video-series/dto/response-video-series.dto";
import { ResponseSeasonDto } from "@models/season/dto/response-season.dto";
import VideoRate from "@models/video-rate/video-rate.entity";
import { ResponseVideo } from "@models/video/dto/response-video";

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private videoInfoService: VideoInfoService,
    private filesService: FilesService,
    @InjectRepository(Genre)
    private genreService: Repository<Genre>,
    @InjectRepository(Publisher)
    private publisherService: Repository<Publisher>,
    @InjectRepository(AgeRating)
    private ageRatingService: Repository<AgeRating>,
    @InjectRepository(Group)
    private groupService: Repository<Group>,
    @InjectRepository(VideoRate)
    private videoRateRepository: Repository<VideoRate>
  ) {
  }

  async create(dto: CreateVideoCombineDto, files) {
    const videoDto: CreateVideoDto = dto;

    const existsAtr: {
      tag: string,
      exists: boolean
    }[] = [];
    existsAtr.push({
      tag: "genreIds",
      exists: await this.genreService.exists({
        where:
          {
            id: In(videoDto.genreIds)
          }
      })
    });
    existsAtr.push({
      tag: "publisherId",
      exists: await this.publisherService.exists({ where: { id: videoDto.publisherId } })
    });
    existsAtr.push({
      tag: "ageRatingId",
      exists: await this.ageRatingService.exists({ where: { id: videoDto.ageRatingId } })
    });

    const wrongAtr = existsAtr.filter(value => !value.exists);
    if (wrongAtr.length > 0) {
      throw new BadRequestException(`Request param ${wrongAtr.map(value => value.tag)} is null or bad value!`);
    }

    if (videoDto.groupId) {
      const exists = await this.groupService.exists({
        where: {
          id: videoDto.groupId
        }
      });
      if (!exists)
        throw new BadRequestException("Request param groupId is not exists.");
    }

    if (!Array.isArray(videoDto.name))
      throw new BadRequestException("Param name is not array!");

    if (files.icon && files.icon[0])
      videoDto.icon = await this.filesService.createFile(TypeFile.PICTURES, files.icon[0]);

    const entityVideo = this.videoRepository.create(videoDto);
    entityVideo.genre = await this.genreService.findBy({ id: In(videoDto.genreIds) });

    if (videoDto.groupId)
      entityVideo.group = await this.groupService.findBy({ id: videoDto.groupId });

    const video: Video = await this.videoRepository.save(entityVideo);

    const reloadVideo = await this.videoRepository.findOne({
      where: {
        id: video.id
      },
      relations: {
        genre: true,
        ageRating: true,
        publisher: true
      }
    });

    const videoInfoDto: CreateVideoInfoDto = dto;
    videoInfoDto.videoId = video.id;
    const videoInfo = await this.videoInfoService.create(videoInfoDto, files.trailers, files.pictures);

    return { video: reloadVideo, videoInfo } as ResponseVideo; //new ResponseVideoCombineDto(reloadVideo, videoInfoRes);
  }

  async update(dto: UpdateVideoDto, files) {
    const video = await this.videoRepository.findOne({ where: { id: dto.id } });
    if (!video)
      throw new BadRequestException("Video id is bad!");

    const existsAtr: {
      tag: string,
      exists: boolean
    }[] = [];
    if (dto.genreIds)
      existsAtr.push({ tag: "genreIds", exists: await this.genreService.exists({ where: { id: In(dto.genreIds) } }) });
    if (dto.publisherId)
      existsAtr.push({
        tag: "publisherId",
        exists: await this.publisherService.exists({ where: { id: dto.publisherId } })
      });
    if (dto.ageRatingId)
      existsAtr.push({
        tag: "ageRatingId",
        exists: await this.ageRatingService.exists({ where: { id: dto.ageRatingId } })
      });
    if (dto.groupId)
      existsAtr.push({ tag: "groupId", exists: await this.groupService.exists({ where: { id: dto.groupId } }) });

    const wrongAtr = existsAtr.filter(value => !value.exists);
    if (wrongAtr.length > 0) {
      throw new BadRequestException(`Request param ${wrongAtr.map(value => value.tag)} is null or bad value!`);
    }

    if (files.icon && files.icon[0]) {
      if (video.icon)
        this.filesService.removeFile(video.icon);
      dto.icon = await this.filesService.createFile(TypeFile.PICTURES, files.icon[0]);
    }

    if (dto.genreIds)
      video.genre = await this.genreService.findBy({ id: In(dto.genreIds) });
    if (dto.groupId)
      video.group = await this.groupService.findBy({ id: dto.groupId });
    await this.videoRepository.update(video.id, video);

    return await this.videoRepository.findOne({
      where: { id: video.id }, relations: {
        genre: true,
        ageRating: true,
        publisher: true
      }
    });
  }

  async getVideoByFilter(dto: FilterVideoQuery, auth: TokenFormat) {
    const search = {
      ...dto
    };
    delete search.dateReleaseMax;
    delete search.dateReleaseMin;
    delete search.genreIds;
    delete search.limit;
    delete search.page;

    const limitRows = dto.limit || 20;

    let searchGenre;
    if (dto.genreIds) {
      searchGenre = {
        genre: {
          id: In(dto.genreIds || [])
        }
      };
    }

    const videos = await this.videoRepository.findAndCount({
      where: {
        ...searchGenre,
        ...search,
        dateRelease: Between(dto.dateReleaseMin || new Date("1968"), dto.dateReleaseMax || new Date())
      },
      relations: {
        genre: true,
        ageRating: true,
        publisher: true
      },
      take: limitRows,
      skip: dto.page * limitRows,
      order: {
        id: "asc"
      }
    });

    const resVideo = await this.addRateToVideo(videos[0], auth);
    return new ResponseCountVideoDto(videos[1], dto.page, resVideo);
  }

  async getVideoByName(dto: SearchVideoQuery, auth: TokenFormat) {
    console.log(dto.name);
    const limitRows = dto.limit || 20;
    const videos = await this.videoRepository.findAndCount({
      where: {
        name: ILike(dto.name)
      },
      relations: {
        genre: true,
        ageRating: true,
        publisher: true
      },
      take: limitRows,
      skip: dto.page * limitRows,
      order: {
        id: "asc"
      }
    });

    const resVideo = await this.addRateToVideo(videos[0], auth);
    return new ResponseCountVideoDto(videos[1], dto.page, resVideo);
  }


  async get(dto: GetVideoQuery, auth: TokenFormat) {
    const video = await this.videoRepository.findOne({
      where: { id: dto.id },
      relations: {
        genre: true,
        videoInfo: true,
        videoSeries: true,
        listView: true,
        group: true,
        season: true,
        ageRating: true,
        publisher: true
      }
    });

    const rate = await this.videoRateRepository.average("rate", {
      videoId: video.id
    });

    const yourRate = auth ? await this.videoRateRepository.count(
      { where: { videoId: video.id, userId: auth.id } }) : 0;

    if (!video)
      throw new BadRequestException("Video id is bad!");

    const resVideo = { ...video, rate: Math.round(rate * 10) / 10, yourRate };
    const resInfo = video.videoInfo[0];
    const resSeries = video.videoSeries.map(value => new ResponseVideoSeriesDto(value));
    const resSeason = video.season.map(value => new ResponseSeasonDto(value));

    return new ResponseVideoCombineDto(resVideo, resInfo, resSeries, resSeason);
  }

  async addRateToVideo(videos: Video[], auth: TokenFormat) {
    const videoWithRate = [];
    for (const video of videos) {
      const rate = await this.videoRateRepository.average("rate", {
        videoId: video.id
      });
      console.log("Rate", rate);
      //const rate = await this.videoRateRepository.count({where: {videoId: video.id}});
      const yourRate = auth ? await this.videoRateRepository.count(
        { where: { videoId: video.id, userId: auth.id } }) : 0;
      videoWithRate.push({ ...video, rate: Math.round(rate * 10) / 10, yourRate });
    }

    return videoWithRate;
  }

  // seed fun

  async createSeed(dto: CreateVideoCombineDto) {
    const videoDto: CreateVideoDto = dto;
    if (dto.icon)
      videoDto.icon = await this.filesService.createFileSeed(TypeFile.PICTURES, dto.icon);

    const entityVideo = this.videoRepository.create(videoDto);
    entityVideo.genre = await this.genreService.findBy({ id: In(videoDto.genreIds) });

    if (videoDto.groupId)
      entityVideo.group = await this.groupService.findBy({ id: videoDto.groupId });

    const video: Video = await this.videoRepository.save(entityVideo);

    const reloadVideo = await this.videoRepository.findOne({
      where: {
        id: video.id
      },
      relations: {
        genre: true,
        ageRating: true,
        publisher: true
      }
    });

    const videoInfoDto: CreateVideoInfoDto = dto;
    videoInfoDto.videoId = video.id;
    const videoInfo = await this.videoInfoService.createSeed(videoInfoDto);
    return { video: reloadVideo, videoInfo } as ResponseVideo; //new ResponseVideoCombineDto(reloadVideo, videoInfoRes);
  }

}
