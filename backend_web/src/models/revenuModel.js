// src/models/revenu.js

module.exports = (sequelize, DataTypes) => {
  const Revenu = sequelize.define("Revenu", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    lot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    quantite_vendue: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    montant_total: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    date_vente: {
      type: DataTypes.DATE,
      allowNull: false
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: "revenu",
    timestamps: true,          // createdAt & updatedAt
    paranoid: true,            // remplace ton deleted_at manuel
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at",    // correspond à ta colonne existante
  });

  // 🔗 Relations (si tu as un model Lot)
  Revenu.associate = (models) => {
    Revenu.belongsTo(models.Lot, {
      foreignKey: "lot_id",
      as: "lot"
    });
  };

  return Revenu;
};