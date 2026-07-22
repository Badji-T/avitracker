const { Perte } = require("../models");
const perteService = require("../services/perteService");
const lotService = require("../services/lotServices");

exports.getPertes = async (req, res) => {
  try {
    // ⚠️ Corrigé : findAll(req.params.id) n'a pas de sens (findAll attend
    // un objet d'options, pas un id). Sans filtre précis côté route,
    // on renvoie simplement toutes les pertes.
    const pertes = await Perte.findAll();
    res.json(pertes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getPerte = async (req, res) => {
  try {
    const perte = await Perte.findByPk(req.params.id);
    res.json(perte);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.createPerte = async (req, res) => {
  try {
    const perte = await perteService.createPerte(req.body);
    res.status(201).json({
      message: "Perte enregistrée",
      perte,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.updatePerte = async (req, res) => {
  try {
    const { lot_id, quantite, cause, date_perte } = req.body;

    // On recalcule le montant comme à la création, pour rester cohérent
    // si la quantité change (sinon le montant stocké devient faux).
    const coutMoyen = await lotService.calculCoutMoyenVolaille(lot_id);
    const montant = quantite * coutMoyen;

    await Perte.update(
      { lot_id, quantite, montant, cause, date_perte },
      { where: { id: req.params.id } }
    );

    res.json({ message: "Perte modifiée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.deletePerte = async (req, res) => {
  try {
    await Perte.destroy({ where: { id: req.params.id } });
    res.json({ message: "Perte supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};