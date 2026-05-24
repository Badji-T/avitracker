const {Lot} = require("../models");
const lotService = require("../services/lotServices");

//Liste lots
const getLots = async (req, res) => {
  try {
    const lot = await Lot.findAll(req.params.id);
    res.json(lot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

//Lot par id
const getLot = async (req, res) => {
  try {
    const lot = await Lot.findByPk(req.params.id);
    res.json(lot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

//Creer un lot
const createLot = async (req, res) => {
  try {
    await Lot.create({
      nom_lot: req.body.nom_lot,
      user_id: req.body.user_id,
      espece_id: req.body.espece_id,
      quantite_initiale: req.body.quantite_initiale,
      date_arrivee: req.body.date_arrivee
    });

    res.json({ message: "Lot créé"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

//Modifier un lot
const updateLot = async (req, res) => {
  try {
    await Lot.update(
      {
        nom_lot: req.body.nom_lot,
        user_id: req.body.user_id,
        espece_id: req.body.espece_id,
        quantite_initiale: req.body.quantite_initiale,
        date_arrivee: req.body.date_arrivee
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


//Supprimer un lot
const deleteLot = async (req, res) => {
  try {
    await Lot.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Lot supprimé" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//Résumé d'un lot
const getLotSummary = async (req, res) => {

    try {
        const { id } = req.params;

        const summary =
            await lotService.getLotSummary(id);

        res.status(200).json(summary);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getLots,
    getLot,
    createLot,
    updateLot,
    deleteLot,
    getLotSummary
};