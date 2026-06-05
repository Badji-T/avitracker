'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('depense', 'code_depense', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: 'id'
    });
    await queryInterface.addColumn('perte', 'code_perte', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: 'id'
    });
    await queryInterface.addColumn('vente', 'code_vente', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      after: 'id'
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
