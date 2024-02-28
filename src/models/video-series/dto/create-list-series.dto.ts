import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNumber, IsOptional,} from "class-validator";
import {CreateVideoSeriesDto} from "@models/video-series/dto/create-video-series.dto";

export class CreateListSeriesDto {

    @ApiProperty({example: "1", description: 'VideoId'})
    @IsNumber({}, {message: 'Is not number.'})
    videoId: number;

    @ApiProperty({example: '1', description: 'SeasonId'})
    @IsNumber({}, {message: 'Is not number.'})
    @IsOptional()
    readonly seasonId?: number;

    @ApiProperty({
        description: 'VideoId',
        type: [CreateVideoSeriesDto]
    })
    @IsArray()
    readonly series: CreateVideoSeriesDto[];
}
