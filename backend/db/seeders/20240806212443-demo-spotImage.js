'use strict';
const { SpotImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'SpotImage'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://www.greatschools.org/gk/wp-content/uploads/2014/03/The-school-visit-what-to-look-for-what-to-ask-1-360x180.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-857387972692815761/original/d106e0ef-f825-4ff8-baf7-86256a54fbd5.jpeg?im_w=720&im_q=highq",
        preview: false
      },
      {
        spotId: 3,
        url: "https://media.architecturaldigest.com/photos/5fdba5629542eda0bedf1080/master/pass/60d85131-b43f-4edb-8051-28c0e6bd377a.jpg", 
        preview: false
      },
      {
        spotId: 4,
        url: "https://www.refinery29.com/images/11652821.jpg?format=webp&width=720&height=864&quality=85&crop=1333%2C1600%2Cx724%2Cy0",
        preview: true
      },
      {
        spotId: 5,
        url: "https://cdn1.matadornetwork.com/blogs/1/2022/09/charming-newly-renovated-bungalow-exterior-airbnb-tampa.jpg", 
        preview: Math.random() < 0.5 //randomly set value
      }
    ],  { validate: true })
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
