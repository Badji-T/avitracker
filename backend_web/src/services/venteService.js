const { Vente, Lot, Espece } = require("../models");
const lotService = require("./lotServices");
const { Op } = require("sequelize");

// CREER LE CODE D'UNE VENTE
const generateVenteCode = async (lotId) => {

  // ⚠️ Corrigé : il faut préciser l'alias "espece" (défini dans Lot.associate),
  // et Espece doit être importé en haut du fichier.
  const lot = await Lot.findByPk(lotId, {
    include: { model: Espece, as: "espece" },
  });

  if (!lot) {
    throw new Error("Lot introuvable");
  }

  // ⚠️ Corrigé : lot.Espece n'existe pas, l'alias est "espece" (minuscule),
  // et le champ s'appelle "code_espece" (pas "code").
  const codeEspece = lot.espece.code_espece.substring(0, 3);

  const now = new Date();
  const date =
    `${String(now.getDate()).padStart(2, "0")}` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${now.getFullYear()}`;

  const prefix = `VTE-${codeEspece}-${date}`;

  const lastVente = await Vente.findOne({
    where: { code_vente: { [Op.like]: `${prefix}%` } },
    order: [["code_vente", "DESC"]],
  });

  let nextNumber = 1;

  if (lastVente) {
    nextNumber = parseInt(lastVente.code_vente.split("-").pop()) + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
};

// Créer une vente
const createVente = async (data) => {

  const { lot_id, quantite_vendue } = data;
  const prix_unitaire = Number(data.prix_unitaire ?? data.prix_vente_unitaire ?? 0);

  if (!prix_unitaire || prix_unitaire <= 0) {
    throw new Error("Prix de vente unitaire invalide");
  }

  // Vérifier que le lot existe
  const lot = await Lot.findByPk(lot_id);

  if (!lot) {
    throw new Error("Lot introuvable");
  }

  // ⚠️ Corrigé : on appelle generateVenteCode directement (pas
  // "venteService.generateVenteCode", qui n'existe pas dans ce scope),
  // et on utilise lot_id (venant de "data"), pas "req.body.lot_id"
  // (req n'existe pas dans un service, ce n'est pas une route).
  const code_vente = await generateVenteCode(lot_id);

  // Vérifier stock disponible
  const quantiteRestante = await lotService.calculQuantiteRestante(lot_id);

  if (quantite_vendue > quantiteRestante) {
    throw new Error("Stock insuffisant");
  }

  // Prix de vente = coût de revient moyen du lot (choix assumé : pas de
  // prix de vente distinct du coût de revient pour l'instant)
  const montant_total = prix_unitaire * quantite_vendue;
  const cout_sujets_vendus =
    (await lotService.calculCoutMoyenVolaille(lot_id)) * quantite_vendue;
  const benefice = montant_total - cout_sujets_vendus;

  const vente = await Vente.create({
    lot_id,
    code_vente,
    quantite_vendue,
    prix_unitaire,
    montant_total,
    cout_sujets_vendus,
    benefice,
    date_vente: new Date(),
  });

  // ⚠️ Supprimé : lot.quantite_restante n'existe pas dans le modèle Lot
  // (voir models.txt). La quantité restante est déjà recalculée à la
  // volée par lotService.calculQuantiteRestante() à partir de
  // quantite_initiale - pertes - ventes, donc rien à stocker ici.

  return vente;
};

// Modifier une vente
const updateVente = async (id, data) => {
  const vente = await Vente.findByPk(id);

  if (!vente) {
    throw new Error("Vente introuvable");
  }

  const { lot_id, quantite_vendue } = data;
  const prix_unitaire = Number(data.prix_unitaire ?? data.prix_vente_unitaire ?? 0);

  if (!prix_unitaire || prix_unitaire <= 0) {
    throw new Error("Prix de vente unitaire invalide");
  }

  // On recalcule le prix et le montant, comme à la création
  const montant_total = prix_unitaire * quantite_vendue;
  const cout_sujets_vendus =
    (await lotService.calculCoutMoyenVolaille(lot_id)) * quantite_vendue;
  const benefice = montant_total - cout_sujets_vendus;

  await vente.update({
    lot_id,
    quantite_vendue,
    prix_unitaire,
    montant_total,
    cout_sujets_vendus,
    benefice,
  });

  return vente;
};

// Obtenir toutes les ventes
const getAllVentes = async () => {
  return await Vente.findAll({
    include: [{ model: Lot, as: "lot" }],
  });
};

// Obtenir une vente
const getVenteById = async (id) => {
  const vente = await Vente.findByPk(id, {
    include: [{ model: Lot, as: "lot" }],
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

  // ⚠️ Supprimé : même raison que dans createVente, "quantite_restante"
  // n'existe pas sur le modèle Lot. Le soft delete de la vente suffit :
  // calculQuantiteRestante() ne comptera plus cette vente une fois
  // supprimée (paranoid: true sur le modèle Vente).
  await vente.destroy();

  return true;
};

module.exports = {
  generateVenteCode,
  createVente,
  updateVente,
  getAllVentes,
  getVenteById,
  deleteVente,
};
