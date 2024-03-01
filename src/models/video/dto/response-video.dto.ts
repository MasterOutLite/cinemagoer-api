import Video from "@models/video/video.entity";
import { ResponseGenreDto } from "@models/genre/dto/response-genre.dto";
import { ResponseAgeRatingDto } from "@src/models/age-rating/dto/response-age-rating.dto";
import { ResponsePublisherDto } from "@src/models/publisher/dto/response-publisher.dto";
import { ApiProperty } from "@nestjs/swagger";
import { VideoCategory } from "@models/video/video-category";
import { VideoStatus } from "@models/video/video-status";
import { VideoType } from "@models/video/video-type";

export class ResponseVideoDto {
  constructor(video: Video, withoutDesc = true) {
    this.id = video.id;
    this.name = video.name;
    this.dateRelease = video.dateRelease;
    this.seasonOfYear = video.seasonOfYear;
    this.genre = video.genre.map(value => new ResponseGenreDto(value, withoutDesc));
    this.videoCategory = video.videoCategory;
    this.type = video.type;
    this.status = video.status;
    this.publisher = new ResponsePublisherDto(video.publisher, withoutDesc);
    this.ageRating = new ResponseAgeRatingDto(video.ageRating, withoutDesc);
    this.icon = video.icon;
  }

  @ApiProperty({ example: "1", description: "Id video." })
  id: number;

  @ApiProperty({ example: "6.3", description: "Video rate" })
  rate?: number;

  @ApiProperty({ example: "6.3", description: "Your video rate" })
  yourRate?: number;

  @ApiProperty({ example: ["Wolf", "Вовк"], description: "Name video." })
  name: string[];

  @ApiProperty({ type: Date, description: "Email unique user." })
  dateRelease: Date;

  @ApiProperty({ type: ResponseGenreDto, isArray: true, description: "Genre (Roman, Fight, ...)." })
  genre: ResponseGenreDto[];

  @ApiProperty({ example: 1, description: "Season of year (Winter, Spring, Summer, Autumn)." })
  seasonOfYear: number;

  @ApiProperty({ example: VideoType.Movie, description: "Type video (Film, Serial, ...)." })
  type: VideoType;

  @ApiProperty({ example: VideoStatus.Announced, description: "Status video (Release, Waiting, ...)." })
  status: VideoStatus;

  @ApiProperty({ example: 1, description: "Video category (Film, Cartoon, ...)." })
  videoCategory: VideoCategory;

  @ApiProperty({ type: ResponsePublisherDto, description: "Publisher name (The Walt Disney Company, Pixar, ...)." })
  publisher: ResponsePublisherDto;

  @ApiProperty({ type: ResponseAgeRatingDto, description: "Age rating (18+, 16+, PG-13, ...)." })
  ageRating: ResponseAgeRatingDto;

  @ApiProperty({ example: "pictures/bfb73574-64dc-4fb6-97a7-9dfe9ac4aa5f.jpg4", description: "Icon video." })
  icon: string;
}
