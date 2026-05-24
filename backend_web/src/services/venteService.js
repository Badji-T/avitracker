const { Vente, Lot } = require("../models");
const lotService = require("./lotServices");


// Créer une vente
const createVente = async (data) => {

  const {
    lot_id,
    quantite_vendue
  } = data;

  // Vérifier que le lot existe
  const lot = await Lot.findByPk(lot_id);

  if (!lot) {
    throw new Error("Lot introuvable");
  }

  // Vérifier stock disponible
  if (quantite_vendue > await lotService.calculQuantiteRestante(lot_id)) {
    throw new Error("Stock insuffisant");
  }

  // Prix actuel du lot
  const prix_unitaire = await lotService.calculCoutMoyenVolaille(lot_id); 

  // Calcul montant total
  const montant_total = prix_unitaire * quantite_vendue;

  // Création vente
  const vente = await Vente.create({
    lot_id,
    quantite_vendue,
    prix_unitaire,
    montant_total,
    date_vente: new Date()
  });

  // Mise à jour stock
  await lot.update({
    quantite_restante: await lotService.calculQuantiteRestante(lot_id) - quantite_vendue
  });

  return vente;
};


// Obtenir toutes les ventes
const getAllVentes = async () => {

  return await Vente.findAll({
    include: [
      {
        model: Lot,
        as: "lot"
      }
    ]
  });
};

// Obtenir une vente
const getVenteById = async (id) => {

  const vente = await Vente.findByPk(id, {
    include: [
      {
        model: Lot,
        as: "lot"
      }
    ]
  });

  if (!vente) {
    throw new Error("Vente introuvable");
  }

  return vente;
};

// Supprimer une vente
const deleteVente = async (id) => {

  const vente = await Vente.findByPk(id);

  if (!vente) {
    throw new Error("Vente introuvable");
  }

  // Restaurer le stock
  const lot = await Lot.findByPk(
    vente.lot_id
  );

  await lot.update({
    quantite_restante:
      lot.quantite_restante +
      vente.quantite_vendue
  });

  // Soft delete
  await vente.destroy();

  return true;
};


module.exports = {
  createVente,
  getAllVentes,
  getVenteById,
  deleteVente
};