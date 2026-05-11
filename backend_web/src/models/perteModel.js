// src/models/perte.js

module.exports = (sequelize, DataTypes) => {
  const Perte = sequelize.define("Perte", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    lot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    montant: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    cause: {
      type: DataTypes.STRING,
      allowNull: false
    },

    date_perte: {
      type: DataTypes.DATE,
      allowNull: false
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: "perte",
    timestamps: true,          // createdAt & updatedAt
    paranoid: true,            // soft delete automatique
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  // Relations
  Perte.associate = (models) => {
    // une perte appartient à un lot
    Perte.belongsTo(models.Lot, {
      foreignKey: "lot_id",
      as: "lot"
    });
  };

  return Perte;
};