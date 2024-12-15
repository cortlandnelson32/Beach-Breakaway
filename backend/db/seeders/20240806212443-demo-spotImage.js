'use strict';
const { SpotImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */
let options = {};
options.tableName = 'SpotImages';
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://s3.us-east-2.amazonaws.com/havenlifestyles/a11033488-1.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://www.ridgefrontrealty.com/wp-content/uploads/2015/03/N.-Bay-Road-37000000.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "https://interiordesign.net/wp-content/uploads/2024/05/InteriorDesign_May2024_on-the-beach-13.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://boutique-homes-prod.sfo3.cdn.digitaloceanspaces.com/properties/2215/malibu-beach-house-sand-and-surf_beachhouse_malibu-california-us_exterior-beach-terrace-1712085593517.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "https://photos.zillowstatic.com/fp/714df0c1f28df0080ba67af74c40a3f1-p_e.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "https://ap.rdcpix.com/b98a3c09505154c327a2eab8bb673110l-m2919667385rd-w480_h360.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "https://images.elliottbeachrentals.com/header-secondrow-homes_01-13-2021.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://www.condolux.net/images/rental-photos/blue-heaven-main.jpg",
        preview: false
      },
      {
        spotId: 5,
        url: "https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/virginiabeachva/lynnhavennight_938F02A8-CA18-42A6-A801D8914A6C0E1F_560d82af-f118-4939-bb4899a7cf08e142.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://learncalifornia.org/wp-content/uploads/2023/12/luxury-homes-for-sale-laguna-beach-1024x585.jpg",
        preview: true
      },
      {
        spotId: 7,
        url: "https://static1.mansionglobal.com/production/media/article-images/58c8b1858e6b1460f1a653fcefc5e5c1/large_SantaMonica2.jpg",
        preview: true
      },
      {
        spotId: 8,
        url: "https://cdn.listingphotos.sierrastatic.com/pics2x/v1720462091/75/75_1123542_01.jpg",
        preview: true
      },
      {
        spotId: 9,
        url: "https://track-pm.s3.amazonaws.com/sandnsea/image/4fc43844-bea6-4b19-850c-734de0459caf",
        preview: true
      },
      {
        spotId: 10,
        url: "https://qa-ap.rdcpix.com/96e9cf7f799ef42cca78fcc2f7471bf0l-m3783786741rd-w480_h360.jpg",
        preview: true
      },
      {
        spotId: 11,
        url: "https://www.naplesrealestate.com/wp-content/uploads/2017/03/slider3.jpg",
        preview: true
      },
      {
        spotId: 12,
        url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/419208402.jpg?k=02cfac88b840a8bad330ae7b1550d3a9cc8cf8f58811eb8357e7e21a09d9b109&o=&hp=1",
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
