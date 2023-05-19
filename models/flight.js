'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      Flight.hasMany(models.Booking, { foreignKey: 'flightId' });
      Flight.hasOne(models.FlightConfiguration);
    }
  }

  Flight.init(
    {
      route: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Flight',
    }
  );

  return Flight;
};
