import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import {
  IGroup,
  Permission,
  PermissionType,
} from '../interfaces/group.interface';
import { UserGroup } from './user-group.model.';

@Table({ tableName: 'Groups' })
export class Group extends Model<Group, IGroup> {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(Permission))),
    allowNull: false,
  })
  permissions: PermissionType[];

  @BelongsToMany(() => User, () => UserGroup)
  users: User[];
}
