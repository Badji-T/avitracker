module.exports = (sequelize, DataTypes) => {

  const Vente = sequelize.define("Vente", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    code_vente: {
      type: DataTypes.STRING,
      allowNull: false
    },

    lot_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    prix_unitaire: {
      type: DataTypes.FLOAT,
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

    nom_client: {
      type: DataTypes.STRING,
      allowNull: true
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {

    tableName: "vente",

    timestamps: true,

    paranoid: true,

    deletedAt: "deleted_at",

    createdAt: "created_at",

    updatedAt: "updated_at"

  });

  // Relations
  Vente.associate = (models) => {

    Vente.belongsTo(models.Lot, {

      foreignKey: "lot_id",

      as: "lot"
    });
  };

  return Vente;
};