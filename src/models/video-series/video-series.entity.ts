import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Video from "@models/video/video.entity";
import Season from "@models/season/season.entity";

@Entity({name: 'video-series'})
class VideoSeries {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Video, video => video.videoSeries)
    video: Video;
    @Column()
    videoId: number;

    @Column()
    series: number;

    @Column()
    name: string;

    @Column()
    dateRelease: Date;

    @Column({default: false})
    release: boolean;

    @ManyToOne(() => Season, season => season.videoSeries)
    season: Season;
    @Column({nullable: true})
    seasonId: number;

    @Column({nullable: true})
    dayOfWeek: number;

}

export default VideoSeries;
