const Perte = require("../models/perteModel");

exports.getPertes = (req, res) => {
  Perte.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getPerte = (req, res) => {
  Perte.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createPerte = (req, res) => {
  Perte.create(req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Perte créée" });
  });
};

exports.updatePerte = (req, res) => {
  Perte.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Perte modifiée" });
  });
};

exports.deletePerte = (req, res) => {
  Perte.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Perte supprimée" });
  });
};