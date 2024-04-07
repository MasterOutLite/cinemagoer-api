import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import UserListView from '@models/user-list-view/user-list-view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ListView from '@models/list-view/list-view.entity';
import { Repository } from 'typeorm';
import Video from '@models/video/video.entity';
import { CreateUserListViewDto } from '@models/user-list-view/dto/create-user-list-view.dto';
import { CreateListViewDto } from '@models/user-list-view/dto/create-list-view.dto';
import { TokenFormat } from '@src/auth/dto/TokenFormat';
import { CheckExists } from '@src/exception/CheckExists';
import { ResponseListViewDto } from '@models/user-list-view/dto/response-list-view.dto';
import { StateAction } from '@models/user-list-view/dto/state-action';
import { GetUserListViewQuery } from '@models/user-list-view/query/get-user-list-view.query';
import { th } from '@faker-js/faker';

@Injectable()
export class UserListViewService {
  constructor(
    @InjectRepository(UserListView)
    private userListViewRepository: Repository<UserListView>,
    @InjectRepository(ListView)
    private listViewRepository: Repository<ListView>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async create(dto: CreateUserListViewDto) {
    console.log('Create', 'UserListView', dto);
    return await this.userListViewRepository.save(dto);
  }

  async delete(videoId: number, id: number, auth: TokenFormat) {
    console.log('Delete', 'UserListView', { videoId, id });
    const userList = await this.userListViewRepository.findOne({
      where: { userId: auth.id, id: id },
    });
    console.log(userList);
    if (!userList || userList.userId != auth.id)
      throw new ForbiddenException('It`s not your list view.');

    const video = await this.listViewRepository.findOne({
      where: { userListViewId: id, videoId },
    });

    if (video) await this.listViewRepository.delete(video.id);
    else
      throw new BadRequestException(
        `Not found video in User list view: ${videoId}`,
      );
  }

  async add(dto: CreateListViewDto, auth: TokenFormat) {
    const check: CheckExists = new CheckExists();
    console.log('Add', 'UserListView', dto);
    check.add({
      tag: 'userListViewId',
      exists: await this.existsOwnUser(dto.userListViewId, auth.id),
    });
    check.add({
      tag: 'videoId',
      exists: await this.videoRepository.exists({ where: { id: dto.videoId } }),
    });
    check.checkAndThrow();

    let response: ResponseListViewDto;

    const existsWherever = await this.listViewRepository.findOne({
      where: {
        videoId: dto.videoId,
        userListView: {
          userId: auth.id,
        },
      },
    });

    if (!existsWherever || dto.action === StateAction.CREATE) {
      //create
      const listView = await this.listViewRepository.save(dto);
      response = new ResponseListViewDto(listView, true, StateAction.CREATE);
    } else if (
      existsWherever.userListViewId == dto.userListViewId ||
      dto.action === StateAction.REMOVE
    ) {
      //remove
      await this.listViewRepository.delete(existsWherever.id);
      response = new ResponseListViewDto(
        existsWherever,
        false,
        StateAction.REMOVE,
      );
    } else if (dto.action === StateAction.CHANGE) {
      //change userListViewId
      existsWherever.userListViewId = dto.userListViewId;
      const update = await this.listViewRepository.update(
        existsWherever.id,
        existsWherever,
      );
      console.log('Update', update, update.generatedMaps, update.raw);
      response = new ResponseListViewDto(
        existsWherever,
        true,
        StateAction.CHANGE,
      );
    }

    const checkAgain = await this.listViewRepository.findOne({
      where: {
        videoId: dto.videoId,
        userListView: {
          userId: auth.id,
        },
      },
    });
    
    console.log('Add', 'Res', response, checkAgain);
    return response;
  }

  async getAll(query: GetUserListViewQuery) {
    return await this.userListViewRepository.find({
      where: { userId: query.userId },
    });
  }

  async getAllWithVideo(query: GetUserListViewQuery) {
    return await this.userListViewRepository.find({
      where: { userId: query.userId },
      relations: {
        listView: {
          video: true,
        },
      },
    });
  }

  async getListViewWhereVideo(videoId: number, userId: number) {
    const listView = await this.listViewRepository.findOne({
      where: {
        videoId,
        userListView: {
          userId,
        },
      },
      relations: {
        userListView: true,
      },
    });
    return { listView, notFound: !listView };
  }

  private async existsOwnUser(id: number, userId: number): Promise<boolean> {
    const list = await this.userListViewRepository.findOne({
      where: { id, userId },
    });
    return list !== null;
  }
}
