const Lot = require("../models/lotModel");

exports.getLots = (req, res) => {
  Lot.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getLot = (req, res) => {
  Lot.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createLot = (req, res) => {
  Lot.create(req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Lot créé" });
  });
};

exports.updateLot = (req, res) => {
  Lot.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Lot modifié" });
  });
};

exports.deleteLot = (req, res) => {
  Lot.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Lot supprimé" });
  });
};