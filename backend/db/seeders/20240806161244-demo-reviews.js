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
        userId: 1,
        spotId: 1,
        review: "Great location, but a bit noisy.",
        stars: 3,
      },
      {
        userId: 2,
        spotId: 1,
        review: "Loved the beach view!",
        stars: 4,
      },
      {
        userId: 3,
        spotId: 1,
        review: "A cozy retreat near all the action.",
        stars: 5,
      },
      // Reviews for Spot 2
      {
        userId: 1,
        spotId: 2,
        review: "Place was clean and comfortable.",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 2,
        review: "Amazing host, highly recommend!",
        stars: 4,
      },
      {
        userId: 4,
        spotId: 2,
        review: "Could use some updates.",
        stars: 3,
      },
      // Reviews for Spot 3
      {
        userId: 2,
        spotId: 3,
        review: "Disappointed with the amenities.",
        stars: 2,
      },
      {
        userId: 3,
        spotId: 3,
        review: "Nice location, but noisy at night.",
        stars: 3,
      },
      {
        userId: 4,
        spotId: 3,
        review: "Perfect getaway spot!",
        stars: 5,
      },
      // Reviews for Spot 4
      {
        userId: 3,
        spotId: 4,
        review: "This was an awesome spot!",
        stars: 5,
      },
      {
        userId: 1,
        spotId: 4,
        review: "Great location and view.",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 4,
        review: "Comfortable stay, but a bit pricey.",
        stars: 3,
      },
      // Reviews for Spot 5
      {
        userId: 1,
        spotId: 5,
        review: "Amazing host, highly recommend!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 5,
        review: "Lovely stay with great amenities.",
        stars: 5,
      },
      {
        userId: 3,
        spotId: 5,
        review: "Enjoyed my time here.",
        stars: 4,
      },
      // Reviews for Spot 6
      {
        userId: 4,
        spotId: 6,
        review: "Great location, but a bit noisy.",
        stars: 3,
      },
      {
        userId: 1,
        spotId: 6,
        review: "Loved the beach vibe!",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 6,
        review: "Comfortable and clean.",
        stars: 4,
      },
      // Reviews for Spot 7
      {
        userId: 1,
        spotId: 7,
        review: "Amazing host, highly recommend!",
        stars: 4,
      },
      {
        userId: 3,
        spotId: 7,
        review: "Nice view and cozy.",
        stars: 4,
      },
      {
        userId: 4,
        spotId: 7,
        review: "Great value for the location.",
        stars: 5,
      },
      // Reviews for Spot 8
      {
        userId: 3,
        spotId: 8,
        review: "Place was clean and comfortable.",
        stars: 4,
      },
      {
        userId: 2,
        spotId: 8,
        review: "Great view, but a bit noisy.",
        stars: 3,
      },
      {
        userId: 1,
        spotId: 8,
        review: "Highly recommend for a quick getaway.",
        stars: 4,
      },
      // Reviews for Spot 9
      {
        userId: 2,
        spotId: 9,
        review: "Disappointed with the amenities.",
        stars: 2,
      },
      {
        userId: 1,
        spotId: 9,
        review: "Great beach access.",
        stars: 4,
      },
      {
        userId: 3,
        spotId: 9,
        review: "Overall, a nice place to stay.",
        stars: 4,
      },
      // Reviews for Spot 10
      {
        userId: 1,
        spotId: 10,
        review: "Loved the beach view and sunny mornings!",
        stars: 4,
      },
      {
        userId: 4,
        spotId: 10,
        review: "Perfect for a weekend retreat.",
        stars: 5,
      },
      {
        userId: 3,
        spotId: 10,
        review: "Highly recommend!",
        stars: 5,
      },
      // Reviews for Spot 11
      {
        userId: 2,
        spotId: 11,
        review: "A lovely place with breathtaking sunsets.",
        stars: 5,
      },
      {
        userId: 1,
        spotId: 11,
        review: "Enjoyed every minute of my stay.",
        stars: 5,
      },
      {
        userId: 4,
        spotId: 11,
        review: "Great spot for a relaxing vacation.",
        stars: 5,
      },
      // Reviews for Spot 12
      {
        userId: 3,
        spotId: 12,
        review: "Truly a tropical paradise, highly recommended!",
        stars: 5,
      },
      {
        userId: 1,
        spotId: 12,
        review: "Amazing views and great host.",
        stars: 5,
      },
      {
        userId: 2,
        spotId: 12,
        review: "Perfect for a tropical getaway.",
        stars: 5
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
