'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Spots', [{
    ownerId: 1,
    address: 'address1',
    city: 'city1',
    state: 'state1',
    country: 'country1',
    lat: 25.0,
    lng: 25.0,
    name: 'john',
    description: 'description1',
    price: 20.50,
    avgRating: 4.5
   }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
