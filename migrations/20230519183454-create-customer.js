'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // ...

async up(queryInterface, Sequelize) {
  await queryInterface.createTable('Customers', {
    // Existing columns
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
},
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers');
  }
};