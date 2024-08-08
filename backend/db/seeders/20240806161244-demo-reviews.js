'use strict';

const { Review } = require('../models');

let options = {};
options.tableName = 'Reviews'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 5,
        spotId: 4,
        review: "This was an awesome spot!",
        stars: 5,
      },
      {
        userId: 4,
        spotId: 1,
        review: "Great location, but a bit noisy.",
        stars: 3,
      },
      {
        userId: 1,
        spotId: 5,
        review: "Amazing host, highly recommend!",
        stars: 4,
      },
      {
        userId: 3,
        spotId: 2,
        review: "Place was clean and comfortable.",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 3,
        review: "Disappointed with the amenities.",
        stars: 2,
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
