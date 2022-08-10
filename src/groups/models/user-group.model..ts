import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Group } from './group.model';

@Table({ tableName: 'UserGroup' })
export class UserGroup extends Model {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => Group)
  @Column
  groupId: string;
}
