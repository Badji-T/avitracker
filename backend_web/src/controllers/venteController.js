const { Vente } = require("../models");
const venteService = require("../services/venteService");


//Liste ventes
const getVentes = async (req, res) => {

  try {

    const ventes = await venteService.getAllVentes();

    res.json(ventes);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};


//Vente par id
const getVente = async (req, res) => {

  try {

    const vente = await venteService.getVenteById(req.params.id);

    res.json(vente);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};


//Créer une vente
const createVente = async (req, res) => {

  try {

    // Calcul automatique du montant total
    const montant_total =
      req.body.quantite_vendue *
      req.body.prix_unitaire;

    await venteService.createVente({
      lot_id: req.body.lot_id,
      quantite_vendue: req.body.quantite_vendue,
      prix_vente: req.body.prix_unitaire,
      montant_total
    });

    res.json({
      message: "Vente créée"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};


//Modifier une vente
const updateVente = async (req, res) => {

  try {

    // Recalcul automatique
    const montant_total =
      req.body.quantite_vendue *
      req.body.prix_unitaire;

    await venteService.updateVente(req.params.id, {
      lot_id: req.body.lot_id,
      quantite_vendue: req.body.quantite_vendue,
      prix_vente: req.body.prix_unitaire,
      montant_total
    });

    res.json({
      message: "Vente modifiée"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};


//Supprimer une vente
const deleteVente = async (req, res) => {

  try {

    await venteService.deleteVente(req.params.id);

    res.json({
      message: "Vente supprimée"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    });
  }
};


module.exports = {
  getVentes,
  getVente,
  createVente,
  updateVente,
  deleteVente
};