import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Video from "@models/video/video.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: "publisher" })
class Publisher {
  @ApiProperty({ example: 1, description: "ID" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Sony pictures", description: "Name Publisher" })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ example: "About publisher", description: "Description" })
  @Column({ type: "text", nullable: true })
  description: string;

  @OneToMany(() => Video, video => video.publisher)
  video: Video[];
}

export default Publisher;
