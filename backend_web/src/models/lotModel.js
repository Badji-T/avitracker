module.exports = (sequelize, DataTypes) => {
  const Lot = sequelize.define("Lot", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    code_lot: {
      type: DataTypes.STRING,
      allowNull: false
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    espece_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    quantite_initiale: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    prix_achat_unitaire: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },

    cout_achat_initial: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },

    date_arrivee: {
      type: DataTypes.DATE,
      allowNull: false
    },

    date_sortie_prevue: {
      type: DataTypes.DATE,
      allowNull: true
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    tableName: "lot",
    timestamps: true,          // createdAt & updatedAt
    paranoid: true,            // soft delete automatique
    deletedAt: "deleted_at",
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  //Relations

  Lot.associate = (models) => {

    Lot.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });

    Lot.belongsTo(models.Espece, {
      foreignKey: "espece_id",
      as: "espece"
    });

    Lot.belongsTo(models.Bloc, {
      foreignKey: "bloc_id",
      as: "bloc"
    });

    Lot.hasMany(models.Vente, {
      foreignKey: "lot_id",
      as: "ventes"
    });

    Lot.hasMany(models.Depense, {
      foreignKey: "lot_id",
      as: "depenses"
    });

    Lot.hasMany(models.Perte, {
      foreignKey: "lot_id",
      as: "pertes"
    });
    
  };

  return Lot;
};
