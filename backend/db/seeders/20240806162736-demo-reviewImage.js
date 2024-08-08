'use strict';

const { ReviewImage } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'ReviewImages'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        image_url: "https://www.mydomaine.com/thmb/LWInT5efjnKDq_YgJGc6-Y0aTz0=/2121x0/filters:no_upscale():strip_icc()/GettyImages-78778405-b6ae008ac1174f079ec9015a72cd7ed2.jpg",
        reviewId: 1
      },
      {
        image_url: "https://i.iheart.com/v3/re/new_assets/61bced9c795bc2256b0a2544?ops=contain(1480,0)",
        reviewId: 2
      },
      {
        image_url: "https://www.travelandleisure.com/thmb/_XsBCRprdQriog2hTCkuiT3f7lc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-airbnb-listing-NEWAIRBNB1123-a67a0e07c4e846e2ae4e653d201e47af.jpg",
        reviewId: 3
      },
      {
        image_url: "https://images.contentstack.io/v3/assets/bltb428ce5d46f8efd8/bltcb75410b7ba627e7/6492190680e98f376224b7dd/image1.png?crop=100p,100p,x0,y0&width=720&height=405&auto=webp", 
        reviewId: 4
      },
      {
        image_url: "https://ibc-static.broad.msu.edu/sites/globaledge/blog/57383.jpg", 
        reviewId: 5
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
