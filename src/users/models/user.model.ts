import { Sequelize, DataTypes, Model } from 'sequelize';
const sequelize = new Sequelize(
  'postgres://dsmcehjd:4pWEHzBci925PfsoinzTbMQ_lHROzqJR@tyke.db.elephantsql.com/dsmcehjd',
);

export class User extends Model {}

User.init(
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
