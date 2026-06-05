const { Vente, Lot } = require("../models");
const lotService = require("./lotServices");
const { Op } = require("sequelize");

//CREER LE CODE D'UNE VENTE
const generateVenteCode = async (lotId) => {

    const lot = await Lot.findByPk( lotId, { include: Espece });

    const codeEspece = lot.Espece.code.substring(0,3);

    const date =
        new Date()
        .toISOString()
        .slice(0,10)
        .replace(/-/g,"");

    const prefix = `VTE-${codeEspece}-${date}`;

    const lastVente = await Vente.findOne({
      where:{ code_vente:{
                  [Op.like]:
                  `${prefix}%`
                }
      },
      order:[
              ["code_vente","DESC"]
            ]
      });

    let nextNumber = 1;

    if(lastVente){

        nextNumber =
            parseInt(
                lastVente.code_vente
                .split("-")
                .pop()
            ) + 1;
    }

    return `${prefix}-${String(nextNumber).padStart(3,"0")}`;
};

// Créer une vente
const createVente = async (data) => {

  const code_vente = await venteService.generateVenteCode(
        req.body.lot_id
  );

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
    code_vente,
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
  generateVenteCode,
  createVente,
  getAllVentes,
  getVenteById,
  deleteVente
};