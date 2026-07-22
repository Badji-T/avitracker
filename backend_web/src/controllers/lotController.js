const { Lot, Espece, Bloc } = require("../models");
const lotService = require("../services/lotServices");

// Liste des lots
const getLots = async (req, res) => {
  try {
    const lots = await Lot.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: Espece,
          as: "espece",
        },
        {
          model: Bloc,
          as: "bloc",
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(lots);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Lot par ID
const getLot = async (req, res) => {
  try {
    const lot = await Lot.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [
        {
          model: Espece,
          as: "espece",
        },
        {
          model: Bloc,
          as: "bloc",
          required: false,
        },
      ],
    });

    if (!lot) {
      return res.status(404).json({
        message: "Lot introuvable",
      });
    }

    res.json(lot);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Créer un lot
const createLot = async (req, res) => {
  try {
    const code_lot = await lotService.generateLotCode(req.body.espece_id);
    const quantiteInitiale = Number(req.body.quantite_initiale || 0);
    const prixAchatUnitaire = Number(req.body.prix_achat_unitaire || 0);

    const lot = await Lot.create({
      code_lot,
      user_id: req.user.id,
      espece_id: req.body.espece_id,
      bloc_id: req.body.bloc_id || null,
      quantite_initiale: quantiteInitiale,
      prix_achat_unitaire: prixAchatUnitaire,
      cout_achat_initial: quantiteInitiale * prixAchatUnitaire,
      date_arrivee: req.body.date_arrivee,
      date_sortie_prevue: req.body.date_sortie_prevue || null,
    });

    res.status(201).json({
      message: "Lot créé avec succès",
      lot,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Modifier un lot
const updateLot = async (req, res) => {
  try {
    const lot = await Lot.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!lot) {
      return res.status(404).json({
        message: "Lot introuvable",
      });
    }

    const quantiteInitiale = Number(req.body.quantite_initiale || 0);
    const prixAchatUnitaire = Number(req.body.prix_achat_unitaire || 0);

    await lot.update({
      espece_id: req.body.espece_id,
      bloc_id: req.body.bloc_id || null,
      quantite_initiale: quantiteInitiale,
      prix_achat_unitaire: prixAchatUnitaire,
      cout_achat_initial: quantiteInitiale * prixAchatUnitaire,
      date_arrivee: req.body.date_arrivee,
      date_sortie_prevue: req.body.date_sortie_prevue || null,
    });

    res.json({
      message: "Lot modifié avec succès",
      lot,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Supprimer un lot
const deleteLot = async (req, res) => {
  try {
    const lot = await Lot.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!lot) {
      return res.status(404).json({
        message: "Lot introuvable",
      });
    }

    await lot.destroy();

    res.json({
      message: "Lot supprimé avec succès",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Résumé d'un lot
const getLotSummary = async (req, res) => {
  try {
    const lot = await Lot.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!lot) {
      return res.status(404).json({
        message: "Lot introuvable",
      });
    }

    const summary = await lotService.getLotSummary(req.params.id);

    res.json(summary);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLots,
  getLot,
  createLot,
  updateLot,
  deleteLot,
  getLotSummary,
};
