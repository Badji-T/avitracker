const { Revenu } = require("../models");

exports.getRevenus = async (req, res) => {
  try {
    const revenu = await Revenu.findAll(req.params.id);
    res.json(revenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getRevenu = async (req, res) => {
  try {
    const revenu = await Revenu.findByPk(req.params.id);
    res.json(revenu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.createRevenu = async (req, res) => {
  try {
    await Revenu.create({
      lot_id: req.body.lot_id,
      quantite_vendue: req.body.quantite_vendue,
      montant_total: req.body.montant_total,
      date_vente: req.body.date_vente
    });

    res.json({ message: "Revenu créé"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.updateRevenu = async (req, res) => {
  try {
    await Revenu.update(
      {
        lot_id: req.body.lot_id,
        quantite_vendue: req.body.quantite_vendue,
        montant_total: req.body.montant_total,
        date_vente: req.body.date_vente
      },
      {
        where: { id: req.params.id }
      }
    );
    res.json({ message: "Revenu modifié" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteRevenu = async (req, res) => {
  try {
    await Revenu.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Revenu supprimé" });
  } catch (err) {
    res.status(500).json(err);
  }
};