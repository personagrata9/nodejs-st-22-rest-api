import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  Sequelize,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

@Table({ tableName: 'RefreshTokens' })
export class RefreshToken extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
    primaryKey: true,
    defaultValue: Sequelize.literal('uuid_generate_v4()'),
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  token: string;

  @BelongsTo(() => User, 'userId')
  user: User;
}
