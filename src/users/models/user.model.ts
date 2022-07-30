import 'dotenv/config';
import { Sequelize, DataTypes, Model } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_URL);

export class UserModel extends Model {}

UserModel.init(
  {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'User',
  },
);
