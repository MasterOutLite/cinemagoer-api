import { BadRequestException, Injectable } from "@nestjs/common";
import { FilesService, TypeFile } from "@src/files/files.service";
import { ExistsException } from "@src/exception/ExistsException";
import VideoInfo from "@models/video-info/video-info.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVideoInfoDto } from "@models/video-info/dto/create-video-info.dto";
import { UpdateVideoInfoDto } from "@models/video-info/dto/update-video-info.dto";

export type VideoInfoFiles = {
  trailers: Express.Multer.File[];
  pictures: Express.Multer.File[];
}


@Injectable()
export class VideoInfoService {
  constructor(
    @InjectRepository(VideoInfo)
    private videoInfoRepository: Repository<VideoInfo>,
    private fileService: FilesService
  ) {
  }

  async createInfo(videoId: number, dto: CreateVideoInfoDto, files: VideoInfoFiles): Promise<VideoInfo> {

    const { trailers, pictures } = await this.saveFile(files.trailers, files.pictures);
    dto.trailers = trailers;
    dto.pictures = pictures;
    return await this.videoInfoRepository.save(dto);
  }

  async updateInfo(videoId: number, dto: UpdateVideoInfoDto, files: VideoInfoFiles): Promise<VideoInfo> {
    const videoInfo = await this.videoInfoRepository.findOne({ where: { id: dto.id } });
    const { trailers, pictures } = await this.saveFile(files.trailers, files.pictures);

    if (dto.mainCharacters)
      videoInfo.mainCharacters = [...videoInfo.mainCharacters, ...dto.mainCharacters];
    if (trailers)
      videoInfo.trailers = [...videoInfo.trailers, ...trailers];
    if (pictures)
      videoInfo.pictures = [...videoInfo.pictures, ...pictures];

    await this.videoInfoRepository.update(videoInfo.id, videoInfo);
    return videoInfo;
  }

  // seed
  async createSeed(dto: CreateVideoInfoDto) {
    const exists: VideoInfo = await this.videoInfoRepository.findOne({ where: { videoId: dto.videoId } });
    if (exists)
      throw new ExistsException();

    const nameTrailers = [];
    if (dto.trailers && dto.trailers.length > 0) {
      for (const trailer of dto.trailers) {
        const name: string = await this.fileService.createFileSeed(TypeFile.TRAILER, trailer);
        nameTrailers.push(name);
      }
      dto.trailers = nameTrailers;
    }

    const namePictures = [];
    if (dto.pictures && dto.pictures.length > 0) {
      for (const picture of dto.pictures) {
        const name: string = await this.fileService.createFileSeed(TypeFile.PICTURES, picture);
        namePictures.push(name);
      }
      dto.pictures = namePictures;
    }

    return await this.videoInfoRepository.save(dto);
  }

  async saveFile(trailers: Express.Multer.File[],
                 pictures: Express.Multer.File[]) {
    const newTrailers: string[] = [];
    if (trailers) {
      for (const trailer of trailers) {
        const name: string = await this.fileService.createFile(TypeFile.TRAILER, trailer);
        newTrailers.push(name);
      }
    }

    const newPictures: string[] = [];
    if (pictures) {
      for (const picture of pictures) {
        const name: string = await this.fileService.createFile(TypeFile.PICTURES, picture);
        newPictures.push(name);
      }
    }

    return { trailers: newTrailers, pictures: newPictures };
  }
}
