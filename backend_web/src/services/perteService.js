const { Lot, Perte, Espece } = require("../models");
const lotService = require("./lotServices");
const { Op } = require("sequelize");

// CREATION CODE PERTE
const generatePerteCode = async (lotId) => {

  // ⚠️ Corrigé : alias "espece" (pas "Espece"), et Espece doit être importé
  const lot = await Lot.findByPk(lotId, {
    include: { model: Espece, as: "espece" },
  });

  if (!lot) {
    throw new Error("Lot introuvable");
  }

  // ⚠️ Corrigé : lot.espece (alias), et "code_espece" (pas "code")
  const codeEspece = lot.espece.code_espece.substring(0, 3);

  const now = new Date();
  const date =
    `${String(now.getDate()).padStart(2, "0")}` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${now.getFullYear()}`;

  const prefix = `PRT-${codeEspece}-${date}`;

  const lastPerte = await Perte.findOne({
    where: { code_perte: { [Op.like]: `${prefix}%` } },
    order: [["code_perte", "DESC"]],
  });

  let nextNumber = 1;

  if (lastPerte) {
    nextNumber = parseInt(lastPerte.code_perte.split("-").pop()) + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
};

// CREATION PERTE
const createPerte = async (data) => {

  const { lot_id, quantite, cause, date_perte } = data;

  // Recuperer le lot
  const lot = await Lot.findByPk(lot_id);

  if (!lot) {
    throw new Error("Lot introuvable");
  }

  const quantiteRestante = await lotService.calculQuantiteRestante(lot_id);

  if (quantite > quantiteRestante) {
    throw new Error("Quantité de perte dépasse le stock disponible");
  }

  // ⚠️ Corrigé : on appelle generatePerteCode directement (pas
  // "perteService.generatePerteCode", qui n'existe pas dans ce scope),
  // et on utilise lot_id venant de "data" (pas "req.body.lot_id" —
  // req n'existe pas dans un service).
  const code_perte = await generatePerteCode(lot_id);

  // Calcul cout moyen
  const coutMoyen = await lotService.calculCoutMoyenVolaille(lot_id);

  // Calcul montant perte
  const montant = quantite * coutMoyen;

  // Creer perte
  const perte = await Perte.create({
    lot_id,
    code_perte,
    quantite,
    montant,
    cause,
    date_perte: date_perte || new Date(),
  });

  return perte;
};

module.exports = {
  generatePerteCode,
  createPerte,
};
