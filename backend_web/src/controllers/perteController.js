const {Perte} = require("../models");
const perteService = require("../services/perteService");

exports.getPertes = async (req, res) => {
  try {
    const perte = await Perte.findAll(req.params.id);
    res.json(perte);
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
        perte
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.updatePerte = async (req, res) => {
  try {
    await Perte.update(
      {
        lot_id: req.body.lot_id,
        quantite: req.body.quantite,
        montant: req.body.montant,
        cause: req.body.cause,
        date_perte: req.body.date_perte
      },
      {
        where: { id: req.params.id }
      }
    );
    res.json({ message: "Perte modifiée" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deletePerte = async (req, res) => {
  try {
    await Perte.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Perte supprimée" });
  } catch (err) {
    res.status(500).json(err);
  }
};