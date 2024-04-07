import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, isEnum } from 'class-validator';
import { StateAction } from './state-action';

export class CreateListViewDto {
  @ApiProperty({ example: 1, description: 'Id user list view' })
  @IsNumber()
  userListViewId: number;

  @ApiProperty({ example: 1, description: 'Id video' })
  @IsNumber()
  videoId: number;

  @ApiProperty({ enum: StateAction, description: 'Add to list or remove' })
  @IsEnum(StateAction)
  action: StateAction;
}
