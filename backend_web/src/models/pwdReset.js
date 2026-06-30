const { DataTypes } = require("sequelize");
const User = require("./userModel");

module.exports = (sequelize) => {
  const PasswordReset = sequelize.define(
    "PasswordReset",
    {
      id: {
        type: DataTypes.UUID,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "password_resets",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: false,
    }
  );

  PasswordReset.associate = (models) => {
    PasswordReset.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };

  return PasswordReset;
};