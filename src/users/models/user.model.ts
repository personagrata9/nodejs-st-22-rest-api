import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/groups/models/group.model';
import { UserGroup } from 'src/groups/models/user-group.model.';

@Table({ tableName: 'Users' })
export class User extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isDeleted: boolean;

  @BelongsToMany(() => Group, () => UserGroup)
  groups: Group[];
}
