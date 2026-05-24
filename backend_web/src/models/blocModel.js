// src/models/depense.js

module.exports = (sequelize, DataTypes) => {
  const Bloc = sequelize.define("Bloc", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    nom_bloc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    
    nombre_de_lot: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

  }, {
    tableName: "bloc",
    timestamps: true,
    paranoid: true,          // soft delete automatique
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  // Relations
  Bloc.associate = (models) => {
    // un bloc contient plusieurs lots
    Bloc.hasMany(models.Lot, {
        foreignKey: "bloc_id",
        as: "lots"
    });
  };

  return Bloc;
};