// src/models/user.js

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      tel: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },

      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      paranoid: true,
      deletedAt: "deleted_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Relations
  User.associate = (models) => {
    // Un utilisateur possède plusieurs espèces
    User.hasMany(models.Espece, {
      foreignKey: "user_id",
      as: "especes",
    });

    // Un utilisateur possède plusieurs lots
    User.hasMany(models.Lot, {
      foreignKey: "user_id",
      as: "lots",
    });

    // Tu pourras ajouter plus tard :
    // User.hasMany(models.Depense, {
    //   foreignKey: "user_id",
    //   as: "depenses",
    // });

    // User.hasMany(models.Vente, {
    //   foreignKey: "user_id",
    //   as: "ventes",
    // });

    // User.hasMany(models.Perte, {
    //   foreignKey: "user_id",
    //   as: "pertes",
    // });
  };

  return User;
};