'use strict';

const { Booking } = require('../models');

let options = {};
options.tableName = 'SpotImage'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2021-11-19',
        endDate: '2021-11-20'
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2022-01-15',
        endDate: '2022-01-18'
      },
      {
        spotId: 3,
        userId: 4,
        startDate: '2022-05-10',
        endDate: '2022-05-12'
      },
      {
        spotId: 4, 
        userId: 1,  
        startDate: '2022-06-01',
        endDate: '2022-06-03'
      }
    ], { validate: true });
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
