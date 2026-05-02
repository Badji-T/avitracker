const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getUser = (req, res) => {
  User.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.mot_de_passe, 10, (err, hash) => {
    if (err) return res.status(500).json(err);

    const userData = {
      ...req.body,
      mot_de_passe: hash
    };

    User.create(userData, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Utilisateur créé" });
    });

  });
};

exports.updateUser = (req, res) => {
  User.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Utilisateur modifié" });
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Utilisateur supprimé" });
  });
};