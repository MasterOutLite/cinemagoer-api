import { IsNumber, IsString } from "class-validator";
import { ListViewState } from "@models/user-list-view/list-view-state";

export class CreateUserListViewDto {

  @IsNumber()
  userId: number;

  @IsNumber()
  listViewState: ListViewState;

  @IsString()
  name: string;
}
