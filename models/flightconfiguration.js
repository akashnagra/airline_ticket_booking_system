'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FlightConfiguration extends Model {
    static associate(models) {
      FlightConfiguration.belongsTo(models.Flight, { foreignKey: 'flightId' });
    }
  }

  FlightConfiguration.init(
    {
      seatingCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatingArrangement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FlightConfiguration',
    }
  );

  return FlightConfiguration;
};
