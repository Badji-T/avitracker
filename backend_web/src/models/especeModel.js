// src/models/espece.js

module.exports = (sequelize, DataTypes) => {
  const Espece = sequelize.define("Espece", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    nom_espece: {
      type: DataTypes.STRING,
      allowNull: false
    },

    code_espece: {
      type: DataTypes.STRING,
      allowNull: false
    },

    Description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: "espece",
    timestamps: true,          // createdAt & updatedAt
    paranoid: true,            // soft delete automatique
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at" 
  });

  // Relations
  Espece.associate = (models) => {
    // une espèce possède plusieurs lots
    Espece.hasMany(models.Lot, {
      foreignKey: "espece_id",
      as: "lots"
    });
  };


  return Espece;
};