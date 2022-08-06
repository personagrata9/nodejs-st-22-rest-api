'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Groups', [
      {
        name: 'group1',
        permissions: Sequelize.literal(
          `ARRAY['READ', 'WRITE', 'DELETE']::"enum_Groups_permissions"[]`,
        ),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Groups', null, {});
  },
};
