// src/models/depense.js

module.exports = (sequelize, DataTypes) => {
  const Depense = sequelize.define("Depense", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    code_depense: {
      type: DataTypes.STRING,
      allowNull: false
    },

    lot_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    type_depense: {
      type: DataTypes.STRING,
      allowNull: false
    },

    montant: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    date_depense: {
      type: DataTypes.DATE,
      allowNull: false
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: "depense",
    timestamps: true,
    paranoid: true,          // soft delete automatique
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  // Relations
  Depense.associate = (models) => {
    // une dépense appartient à un lot
    Depense.belongsTo(models.Lot, {
      foreignKey: "lot_id",
      as: "lot"
    });
  };

  return Depense;
};