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
        url: "https://www.mydomaine.com/thmb/LWInT5efjnKDq_YgJGc6-Y0aTz0=/2121x0/filters:no_upscale():strip_icc()/GettyImages-78778405-b6ae008ac1174f079ec9015a72cd7ed2.jpg",
        reviewId: 1
      },
      
      //Add more reviewImages
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
