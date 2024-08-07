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
        address: '123 Main St',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Cozy Apartment',
        description: 'A charming apartment in the heart of San Francisco',
        price: 150.00,
        avgRating: 4.2
      },
      {
        ownerId: 2,
        address: '456 Elm St',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        lat: 34.0522,
        lng: -118.2437,
        name: 'Beachfront House',
        description: 'Luxurious beachfront house with stunning views',
        price: 300.00,
        avgRating: 4.8
      },
      {
        ownerId: 3,
        address: '789 Oak St',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Modern Loft',
        description: 'Stylish loft in the heart of New York City',
        price: 250.00,
        avgRating: 4.5
      },
      {
        ownerId: 4,
        address: '101 Pine St',
        city: 'Seattle',
        state: 'Washington',
        country: 'United States',
        lat: 47.6062,
        lng: -122.3321,
        name: 'Cozy Cabin',
        description: 'Charming cabin in the woods',
        price: 120.00,
        avgRating: 4.3
      },
      {
        ownerId: 5,
        address: '202 Cedar St',
        city: 'Austin',
        state: 'Texas',
        country: 'United States',
        lat: 30.2672,
        lng: -97.7431,
        name: 'Hip Apartment',
        description: 'Trendy apartment in the heart of Austin',
        price: 180.00,
        avgRating: 4.7
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
