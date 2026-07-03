const { DataTypes } = require("sequelize");
const db = require("../config/config");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },

    tel: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true
    },

    role: {
      type: DataTypes.STRING,
      defaultValue: "user"
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: "users",
    timestamps: true, // createdAt & updatedAt
    paranoid: true,   // remplace deleted_at automatiquement
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  User.associate = (models) => {
    User.hasMany(models.Lot, {
      foreignKey: "user_id",
      as: "lots"
    });
};

  return User;
};