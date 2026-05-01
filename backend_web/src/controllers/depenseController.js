const Depense = require("../models/depenseModel");

exports.getDepenses = (req, res) => {
  Depense.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getDepense = (req, res) => {
  Depense.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createDepense = (req, res) => {
  Depense.create(req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Dépense créée" });
  });
};

exports.updateDepense = (req, res) => {
  Depense.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Dépense modifiée" });
  });
};

exports.deleteDepense = (req, res) => {
  Depense.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Dépense supprimée" });
  });
};