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
      {
        url: "https://www.hollywoodreporter.com/wp-content/uploads/2023/03/image_h_01-H-2023.jpg?w=1296&h=730&crop=1",
        reviewId: 1
      },
      {
        url: "https://assets.newatlas.com/dims4/default/3d94d96/2147483647/strip/true/crop/4461x2974+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F38%2Fcc%2Fcb4aa02c4b0ab31f1e5a126d8c9b%2F01-5563-gawthorneshut-caarch-ambercreative.jpg",
        reviewId: 1
      },
      {
        url: "https://img.staticmb.com/mbcontent/images/crop/uploads/2022/12/Most-Beautiful-House-in-the-World_0_1200.jpg",
        reviewId: 1
      },
      {
        url: "https://www.jamesedition.com/stories/wp-content/uploads/2022/03/mansions_main_fin-942x628.jpg",
        reviewId: 1
      },
      {
        url: "https://res.cloudinary.com/brickandbatten/image/upload/w_464,h_283,dpr_2/f_auto,q_auto/v1713267421/wordpress_assets/313364-Alabaster-Caviar-TeakStain-A-copy.jpg?_i=AA",
        reviewId: 1
      },
      {
        url: "https://www.jsonline.com/gcdn/presto/2023/07/24/PMJS/338d29b5-7ecf-4d2d-b9a1-628c8314a481-DZ6540-53.jpg?crop=5749,3234,x0,y288&width=3200&height=1801&format=pjpg&auto=webp",
        reviewId: 1
      },
    ], options)
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
