'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UsersGroups', {
      userId: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id',
        },
      },
      groupId: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        model: {
          tableName: 'Groups',
        },
        key: 'id',
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('UsersGroups');
  },
};
