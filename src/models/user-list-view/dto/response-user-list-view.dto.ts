import { ApiProperty } from "@nestjs/swagger";
import UserListView from "@models/user-list-view/user-list-view.entity";
import Video from "@models/video/video.entity";
import { ListViewState } from "@models/user-list-view/list-view-state";
import { VideoCategory } from "@models/video/enum/video-category";

export class ResponseUserListViewDto {

  constructor(entity: UserListView) {
    this.id = entity.id;
    this.name = entity.name;
    this.userId = entity.userId;
    this.listViewState = entity.listViewState;
  }

  @ApiProperty({ example: 1, description: "Id user list view" })
  id: number;

  @ApiProperty({ example: 1, description: "Id state list view" })
  listViewState: ListViewState;

  @ApiProperty({ example: 1, description: "Id user owner" })
  userId: number;

  @ApiProperty({ example: "Watch now", description: "Name list view" })
  name: string;

  video?: ResponseVideoFromListView[];
}

export class ResponseVideoFromListView {
  constructor(entity: Video) {
    this.id = entity.id;
    this.name = entity.name;
    this.icon = entity.icon;
    this.videoCategory = entity.videoCategory;

  }

  @ApiProperty({ example: "1", description: "Id video." })
  id: number;

  @ApiProperty({ example: "1", description: "Id video category." })
  videoCategory: VideoCategory;

  @ApiProperty({ example: "[\"Wolf\", \"Вовк\"]", description: "Name video." })
  name: string[];

  @ApiProperty({ example: "pictures/bfb73574-64dc-4fb6-97a7-9dfe9ac4aa5f.jpg4", description: "Icon video." })
  icon: string;
}
