// src/models/espece.js

module.exports = (sequelize, DataTypes) => {
  const Espece = sequelize.define(
    "Espece",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      // Propriétaire de l'espèce
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },

      nom_espece: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      code_espece: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      Description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "espece",
      timestamps: true,
      paranoid: true,
      deletedAt: "deleted_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  // Relations
  Espece.associate = (models) => {
    // Une espèce appartient à un utilisateur
    Espece.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    // Une espèce possède plusieurs lots
    Espece.hasMany(models.Lot, {
      foreignKey: "espece_id",
      as: "lots",
    });
  };

  return Espece;
};