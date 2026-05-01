const Espece = require("../models/especeModel");

exports.getEspeces = (req, res) => {
  Espece.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getEspece = (req, res) => {
  Espece.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createEspece = (req, res) => {
  Espece.create(req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Espèce créée" });
  });
};

exports.updateEspece = (req, res) => {
  Espece.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Espèce modifiée" });
  });
};

exports.deleteEspece = (req, res) => {
  Espece.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Espèce supprimée" });
  });
};