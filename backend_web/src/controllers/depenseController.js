const { Depense } = require("../models");
const depenseService = require("../services/depenseService");

exports.getDepenses = async (req, res) => {
  try {
    const depenses = await Depense.findAll();
    res.json(depenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getDepense = async (req, res) => {
  try {
    const depense = await Depense.findByPk(req.params.id);
    res.json(depense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.createDepense = async (req, res) => {
  try {
    const code = await depenseService.generateDepenseCode(
        req.body.lot_id
    );
    await Depense.create({
      code_depense: code,
      lot_id: req.body.lot_id,
      type_depense: req.body.type_depense,
      montant: req.body.montant,
      date_depense: req.body.date_depense
    });

    res.json({ message: "Dépense créée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.updateDepense = async (req, res) => {
  try {
    await Depense.update(
      {
        lot_id: req.body.lot_id,
        type_depense: req.body.type_depense,
        montant: req.body.montant,
        date_depense: req.body.date_depense
      },
      {
        where: { id: req.params.id }
      }
    );
    res.json({ message: "Dépense modifiée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.deleteDepense = async (req, res) => {
  try {
    await Depense.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Dépense supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
