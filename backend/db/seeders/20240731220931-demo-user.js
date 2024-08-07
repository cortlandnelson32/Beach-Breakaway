'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
options.tableName = 'Users'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        username: 'johndoe123',
        hashedPassword: bcrypt.hashSync('password123')
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@example.com',
        username: 'janesmith456',
        hashedPassword: bcrypt.hashSync('password456')
      },
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michaeljohnson@example.com',
        username: 'mjohnson789',
        hashedPassword: bcrypt.hashSync('password789')
      },
      {
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emilybrown@example.com',
        username: 'ebrown987',
        hashedPassword: bcrypt.hashSync('password987')
      },
      {
        firstName: 'David',
        lastName: 'Miller',
        email: 'davidmiller@example.com',
        username: 'dmiller654',
        hashedPassword: bcrypt.hashSync('password654')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
