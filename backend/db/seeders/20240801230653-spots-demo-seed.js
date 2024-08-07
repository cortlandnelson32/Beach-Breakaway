'use strict';

const { Spot } = require('../models');

let options = {};
options.tableName = 'Spots'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
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
        avgRating: 4.5,
      }
      // Add more spots here
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
