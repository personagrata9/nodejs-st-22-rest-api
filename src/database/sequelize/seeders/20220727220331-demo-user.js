'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('Users', [
      {
        login: 'admin',
        password: await bcrypt.hash('admin', 10),
        age: 34,
        isDeleted: false,
      },
    ]);
  },
  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
