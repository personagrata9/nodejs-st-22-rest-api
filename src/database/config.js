// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
