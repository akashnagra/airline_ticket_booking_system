'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Customer, { foreignKey: 'customerId' });
      Booking.belongsTo(models.Flight, { foreignKey: 'flightId' });
    }
  }

  Booking.init(
    {
      seat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );

  return Booking;
};
