const {Espece} = require("../models");
const especeService = require("../services/especeServices");

exports.getEspeces = async (req, res) => {
  try {
    const especes = await Espece.findAll();
    res.json(especes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getEspece = async (req, res) => {
  try {
    const especes = await Espece.findByPk(req.params.id);
    res.json(especes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.createEspece = async (req, res) => {
  try {
    const code = await especeService.generateCodeEspece(
        req.body.nom_espece
      );

    await Espece.create({
      nom_espece: req.body.nom_espece,
      code_espece: code,
      Description: req.body.Description
    });

    res.json({ message: "Espèce créée"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.updateEspece = async (req, res) => {
  try {
    await Espece.update(
      {
        nom_espece: req.body.nom_espece,
        Description: req.body.Description
      },
      {
        where: { id: req.params.id }
      }
    );
    res.json({ message: "Espèce modifiée" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteEspece = async (req, res) => {
  try {
    await Espece.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Espèce supprimée" });
  } catch (err) {
    res.status(500).json(err);
  }
};