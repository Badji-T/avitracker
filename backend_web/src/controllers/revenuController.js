const Revenu = require("../models/revenuModel");

exports.getRevenus = (req, res) => {
  Revenu.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getRevenu = (req, res) => {
  Revenu.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createRevenu = (req, res) => {
  Revenu.create(req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Revenu créé" });
  });
};

exports.updateRevenu = (req, res) => {
  Revenu.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Revenu modifié" });
  });
};

exports.deleteRevenu = (req, res) => {
  Revenu.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Revenu supprimé" });
  });
};