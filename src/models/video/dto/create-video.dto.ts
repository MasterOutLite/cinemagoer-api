import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsDate, IsNumberString, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class CreateVideoDto {
    @IsArray({message: 'Is not array',})
    @ApiProperty({
        description: 'Name video.',
        example: ["Wolf", "Вовк"],
    })
    @Transform(({value}) => (Array.isArray(value) ? value : value.split(',')))
    name: string[];

    @ApiProperty({example: 'Icon file', description: 'Icon file (png, jpeg).', format: 'binary', required: false})
    icon?: string;

    @ApiProperty({example: '2023-9-23', description: 'Date release', format: 'date'})
    @IsDate({message: 'Is not date'})
    @Transform(({value}) => (new Date(value)))
    dateRelease: Date;

    @ApiProperty({example: [1, 6, 7], type: [Number], description: 'Genre (Roman, Fight, ...).',})
    @IsArray({message: 'Is not arr'})
    @Transform(({value}) => (Array.isArray(value) ? value : value.split(',')))
    genreIds: number[];

    @ApiProperty({example: '1', description: 'Type video (Film, Serial, ...).'})
    @IsNumberString({}, {message: 'Is not number'})
    typeId: number;

    @ApiProperty({example: 1, description: 'Season of year (Winter, Spring, Summer, Autumn).'})
    @IsNumberString({}, {message: 'Is not number'})
    seasonOfYear: number;

    @ApiProperty({example: '1', description: 'Status video (Release, Waiting, ...).'})
    @IsNumberString({}, {message: 'Is not number'})
    statusId: number;

    @ApiProperty({example: '1', description: 'Video category (Film, Cartoon, ...).'})
    @IsNumberString({}, {message: 'Is not number'})
    videoCategory: number;

    @ApiProperty({example: '1', description: 'Publisher name (The Walt Disney Company, Pixar, ...).'})
    @IsNumberString({}, {message: 'Is not number'})
    publisherId: number;

    @ApiProperty({example: '1', description: 'Age rating (18+, 16+, PG-13, ...).'})
    @IsNumberString({}, {message: 'Is not number'})
    ageRatingId: number;

    @ApiProperty({example: '1', description: 'Group relation', required: false})
    @IsNumberString({}, {message: 'Is not number'})
    @IsOptional()
    groupId?: number;
}
