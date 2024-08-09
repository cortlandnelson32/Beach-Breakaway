'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    
    static associate(models) {
      // define association here
      Spot.hasMany(models.Review,{
        foreignKey: 'spotId', 
        onDelete: 'CASCADE'
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId', 
        onDelete: 'CASCADE'
      });
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner', //set up alias to match what the cards say. Must obey the cards
        onDelete: 'CASCADE' 
      });
      Spot.hasMany(models.Booking,{ 
        foreignKey: "spotId", 
        onDelete: "CASCADE" 
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [0, 100]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng:{
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
        len: [0,50]
     }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0,
        isFloat: true,
        isNumeric: true
      }
    }

  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
