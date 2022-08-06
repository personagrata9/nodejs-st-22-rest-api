import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Permission, PermissionType } from '../interfaces/group.interface';

@Table
export class Group extends Model {
  @Column
  name: string;

  @Column(DataType.ARRAY(DataType.ENUM(...Object.values(Permission))))
  permissions: PermissionType[];
}
