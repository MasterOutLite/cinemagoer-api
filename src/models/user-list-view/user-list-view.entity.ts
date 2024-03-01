import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import User from "@models/users/users.entity";
import ListView from "@models/list-view/list-view.entity";
import { ListViewState } from "@models/user-list-view/list-view-state";

@Entity({ name: "user-list-view" })
class UserListView {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  listViewState: ListViewState;

  @ManyToOne(() => User, user => user.userListView)
  user: User;
  @Column()
  userId: number;

  @OneToMany(() => ListView, list => list.userListView)
  listView: ListView[];
}


export default UserListView;
