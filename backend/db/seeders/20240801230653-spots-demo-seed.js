'use strict';
const { Spot } = require('../models');
let options = {};
options.tableName = 'Spots';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Beachside Blvd',
        city: 'Miami',
        state: 'Florida',
        country: 'United States',
        lat: 25.7617,
        lng: -80.1918,
        name: 'Oceanfront Paradise',
        description: 'A beautiful beach house with stunning ocean views',
        price: 250.00,
        avgRating: 4.9
      },
      {
        ownerId: 2,
        address: '456 Coastal Rd',
        city: 'Malibu',
        state: 'California',
        country: 'United States',
        lat: 34.0259,
        lng: -118.7798,
        name: 'Malibu Beach House',
        description: 'A luxurious house right on the Malibu beach',
        price: 500.00,
        avgRating: 4.8
      },
      {
        ownerId: 3,
        address: '789 Shoreline Dr',
        city: 'Honolulu',
        state: 'Hawaii',
        country: 'United States',
        lat: 21.3069,
        lng: -157.8583,
        name: 'Tropical Getaway',
        description: 'A serene retreat in the heart of Honolulu',
        price: 400.00,
        avgRating: 4.7
      },
      {
        ownerId: 4,
        address: '101 Beach Ave',
        city: 'Myrtle Beach',
        state: 'South Carolina',
        country: 'United States',
        lat: 33.6891,
        lng: -78.8867,
        name: 'Sunny Beachside Condo',
        description: 'A cozy condo with direct beach access',
        price: 200.00,
        avgRating: 4.5
      },
      {
        ownerId: 5,
        address: '202 Ocean Dr',
        city: 'Virginia Beach',
        state: 'Virginia',
        country: 'United States',
        lat: 36.8529,
        lng: -75.9780,
        name: 'Seaside Escape',
        description: 'A perfect spot for a family vacation by the sea',
        price: 180.00,
        avgRating: 4.6
      },
      {
        ownerId: 3,
        address: '303 Beachfront Ln',
        city: 'Laguna Beach',
        state: 'California',
        country: 'United States',
        lat: 33.5427,
        lng: -117.7854,
        name: 'Laguna Beach Cottage',
        description: 'A charming cottage with breathtaking views',
        price: 350.00,
        avgRating: 4.7
      },
      {
        ownerId: 1,
        address: '404 Sandy Shore',
        city: 'Santa Monica',
        state: 'California',
        country: 'United States',
        lat: 34.0195,
        lng: -118.4912,
        name: 'Santa Monica Retreat',
        description: 'A peaceful retreat near Santa Monica Pier',
        price: 300.00,
        avgRating: 4.8
      },
      {
        ownerId: 2,
        address: '505 Ocean Breeze',
        city: 'Daytona Beach',
        state: 'Florida',
        country: 'United States',
        lat: 29.2108,
        lng: -81.0228,
        name: 'Daytona Beach House',
        description: 'A fun spot near the bustling Daytona Beach Boardwalk',
        price: 220.00,
        avgRating: 4.6
      },
      {
        ownerId: 4,
        address: '606 Seashore Blvd',
        city: 'Galveston',
        state: 'Texas',
        country: 'United States',
        lat: 29.3013,
        lng: -94.7977,
        name: 'Galveston Beachfront',
        description: 'A vibrant beachfront property in Galveston',
        price: 270.00,
        avgRating: 4.7
      },
      {
        ownerId: 5,
        address: '707 Sunlit Ave',
        city: 'Treasure Island Beach',
        state: 'Florida',
        country: 'United States',
        lat: 27.9774,
        lng: -82.8279,
        name: 'Treasure Island Beachfront',
        description: 'A sunlit condo with stunning Gulf views',
        price: 240.00,
        avgRating: 4.5
      },
      {
        ownerId: 1,
        address: '808 Tidal Way',
        city: 'Naples',
        state: 'Florida',
        country: 'United States',
        lat: 26.1420,
        lng: -81.7948,
        name: 'Naples Coastal Retreat',
        description: 'A coastal retreat in Naples with beautiful sunsets',
        price: 320.00,
        avgRating: 4.9
      },
      {
        ownerId: 2,
        address: '909 Paradise Lane',
        city: 'Key West',
        state: 'Florida',
        country: 'United States',
        lat: 24.5551,
        lng: -81.7800,
        name: 'Key West Paradise',
        description: 'A tropical paradise in Key West',
        price: 450.00,
        avgRating: 4.8
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
