import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column
  login: string;

  @Column
  password: string;

  @Column
  age: number;

  @Column({ defaultValue: false })
  isDeleted: boolean;
}
