'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(
        models.Spot,
        {
          foreignKey: 'spotId',
          onDelete: "CASCADE"
        },
      )
    }
  }
  SpotImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      validate: {
        isBoolean(value) {
          if(typeof value !== typeof true)
            throw new Error("Preview must be true or false")
        }
      }
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      exclude: ['spotId', 'createdAt', 'updatedAt']
    }
  });
  return SpotImage;
};
