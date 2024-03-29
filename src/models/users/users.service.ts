import { BadRequestException, Injectable } from "@nestjs/common";
import { FilesService, TypeFile } from "@src/files/files.service";
import { TokenFormat } from "@src/auth/dto/TokenFormat";
import { RoleUser } from "@src/const/role";
import User from "@models/users/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import Role from "@models/role/role.entity";
import { In, Repository } from "typeorm";
import { UserListViewService } from "@models/user-list-view/user-list-view.service";
import { CreateUserDto } from "@models/users/dto/create-user.dto";
import { UserDto } from "@models/users/dto/user.dto";
import { UpdateUserDto } from "@models/users/dto/update-user.dto";
import { ResponseUserDto } from "@models/users/dto/response-user.dto";
import { UpdateUserRoleDto } from "@models/users/dto/update-user-role.dto";
import { ListViewState } from "@models/user-list-view/list-view-state";

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private fileService: FilesService,
    private userListViewService: UserListViewService
  ) {
  }

  async registration(dto: CreateUserDto, useRole?: boolean) {
    const roleId = RoleUser.USER;
    const regRole = (useRole && dto.roles ? dto.roles : []);

    const role = await this.roleRepository.findBy({ id: In([roleId, ...regRole]) });
    const user = this.userRepository.create({ ...dto });
    user.role = role;

    await this.userRepository.save(user);

    await this.userListViewService.create({ userId: user.id, listViewState: ListViewState.Private, name: "Дивлюсь" });
    await this.userListViewService.create({ userId: user.id, listViewState: ListViewState.Private, name: "В планах" });
    await this.userListViewService.create({ userId: user.id, listViewState: ListViewState.Private, name: "Переглянуто" });
    await this.userListViewService.create({ userId: user.id, listViewState: ListViewState.Private, name: "Улюблені" });
    await this.userListViewService.create({ userId: user.id, listViewState: ListViewState.Private, name: "Закинув" });

    return new UserDto(user);
  }

  async updateUser(dto: UpdateUserDto, avatar: Express.Multer.File[], auth: TokenFormat): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: auth.id },
      relations: {
        role: true
      }
    });
    if (avatar && avatar[0]) {
      this.fileService.removeFile(user.avatar);
      user.avatar = await this.fileService.createFile(TypeFile.AVATAR, avatar[0]);
    }

    if (dto.nickname)
      user.nickname = dto.nickname;

    await this.userRepository.update(user.id, user);
    return new ResponseUserDto(user);
  }

  async updateRole(dto: UpdateUserRoleDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: {
        role: true
      }
    });

    if (!user)
      throw new BadRequestException("Not found user!");
    const roles = await this.roleRepository.findBy({
      id: In(dto.roleIds)
    });

    user.role = [...user.role, ...roles];

    await this.userRepository.save(user);
    return new ResponseUserDto(user);
  }

  async get(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: {
        role: true
      }
    });
  }

  async getUserAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find({
      relations: {
        role: true
      }
    });

    const responses: ResponseUserDto[] = [];
    for (const user of users) {
      const res = new ResponseUserDto(user);
      responses.push(res);
    }

    return responses;
  }
}
