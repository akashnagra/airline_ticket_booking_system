'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Booking, { foreignKey: 'customerId' });
    }
  }

  Customer.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'customer',
      },
    },
    {
      sequelize,
      modelName: 'Customer',
      hooks: {
        beforeCreate: async (customer) => {
          const hashedPassword = await bcrypt.hash(customer.password, 10);
          customer.password = hashedPassword;
        },
      },
    }
  );

  return Customer;
};
