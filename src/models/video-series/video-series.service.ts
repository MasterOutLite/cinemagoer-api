import { BadRequestException, Injectable } from '@nestjs/common';
import VideoSeries from '@models/video-series/video-series.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateListSeriesDto } from '@models/video-series/dto/create-list-series.dto';
import Season from '@models/season/season.entity';
import Video from '@models/video/video.entity';
import { ResponseVideoSeriesDto } from '@models/video-series/dto/response-video-series.dto';
import { UpdateListSeriesDto } from '@models/video-series/dto/update-list-series.dto';
import { VideoSeriesQuery } from '@models/video-series/query/video-series.query';
import ResponseSeriesDayOfWeekDto from '@models/video-series/dto/response-series-day-of-week.dto';
import { DayOfWeek } from '@models/video-series/day-of-week';
import { UpdateVideoSeriesDto } from './dto/update-video-series.dto';

@Injectable()
export class VideoSeriesService {
  constructor(
    @InjectRepository(VideoSeries)
    private videoSeriesRepository: Repository<VideoSeries>,
    @InjectRepository(Season)
    private seasonService: Repository<Season>,
    @InjectRepository(Video)
    private videoService: Repository<Video>,
  ) {}

  async create(dto: CreateListSeriesDto): Promise<ResponseVideoSeriesDto[]> {
    const exists = await this.videoService.exists({
      where: { id: dto.videoId },
    });
    if (!exists)
      throw new BadRequestException(`Not found video: ${dto.videoId}`);

    if (dto.seasonId) {
      const existsSeason = await this.seasonService.findOne({
        where: {
          id: dto.seasonId,
        },
      });
      if (!existsSeason || existsSeason.videoId !== dto.videoId)
        throw new BadRequestException(`Not found season: ${dto.seasonId}`);
    }

    const seriesData = [];
    for (const seriesDtoElement of dto.series) {
      const update = {
        ...seriesDtoElement,
        videoId: dto.videoId,
        seasonId: dto.seasonId || null,
      };
      seriesData.push(update);
    }

    const series = await this.videoSeriesRepository.save(seriesData);
    return series.map((value) => new ResponseVideoSeriesDto(value));
  }

  async update(dto: UpdateListSeriesDto) {
    const exists = await this.videoService.exists({
      where: { id: dto.videoId },
    });
    if (!exists)
      throw new BadRequestException(`Not found video: ${dto.videoId}`);

    if (dto.seasonId) {
      const existsSeason = await this.seasonService.findOne({
        where: { id: dto.seasonId },
      });
      if (!existsSeason || existsSeason.videoId !== dto.videoId)
        throw new BadRequestException(`Not found season: ${dto.seasonId}`);
    }

    const response = [];
    for (const seriesDtoElement of dto.series) {
      const series: VideoSeries = await this.videoSeriesRepository.findOne({
        where: { id: seriesDtoElement.id },
      });
      await this.videoSeriesRepository.update(series.id, {
        ...seriesDtoElement,
        seasonId: dto.seasonId,
      });
      response.push(new ResponseVideoSeriesDto(series));
    }

    return response;
  }

  async updateSeries(dto: UpdateVideoSeriesDto) {
    const series: VideoSeries = await this.videoSeriesRepository.findOne({
      where: { id: dto.id },
    });
    if (!series) throw new BadRequestException(`Not found by id: ${dto.id}`);
    series.dateRelease = dto.dateRelease || series.dateRelease;
    series.dayOfWeek = dto.dayOfWeek || series.dayOfWeek;
    series.name = dto.name || series.name;
    series.release = dto.release || series.release;
    series.series = dto.series || series.series;

    this.videoSeriesRepository.update(series.id, series);

    return series;
  }

  async delete(id: number) {
    const series: VideoSeries = await this.videoSeriesRepository.findOne({
      where: { id },
    });
    if (!series) throw new BadRequestException(`Not found by id: ${id}`);
    const res = await this.videoSeriesRepository.delete(id);
  }

  async getAll(dto: VideoSeriesQuery) {
    return await this.videoSeriesRepository.find({
      where: { ...dto },
      order: { id: 'ASC' },
    });
  }

  async getAllByDayOfWeek() {
    const dayOfWeek = [
      DayOfWeek.Monday,
      DayOfWeek.Tuesday,
      DayOfWeek.Wednesday,
      DayOfWeek.Thursday,
      DayOfWeek.Friday,
      DayOfWeek.Saturday,
      DayOfWeek.Sunday,
    ];

    const seriesDayOfWeek = [];
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    const dateForWeek = new Date();
    dateForWeek.setUTCDate(date.getDate() + 6);
    dateForWeek.setUTCHours(23, 59, 59, 59);

    for (const day of dayOfWeek) {
      const series = await this.videoSeriesRepository.find({
        where: {
          dayOfWeek: day,
          dateRelease: Between(date, dateForWeek),
        },
        relations: {
          video: {
            genre: true,
            ageRating: true,
            publisher: true,
          },
        },
      });
      seriesDayOfWeek.push(series);
    }
    const response = [];
    for (const series of seriesDayOfWeek) {
      const resDayOfWeek = series.map(
        (value) => new ResponseSeriesDayOfWeekDto(value),
      );
      response.push(resDayOfWeek);
    }

    return response;
  }
}
