const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.mot_de_passe, 10);

    const userData = await User.create({
      nom: req.body.nom,
      prenom: req.body.prenom,
      tel: req.body.tel,
      mot_de_passe: hashedPassword,
      role: req.body.role
    });

    res.json({ message: "Utilisateur créé"});
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.updateUser = async (req, res) => {
  try {
    await User.update(
      {
        nom: req.body.nom,
        tel: req.body.tel,
        mot_de_passe: req.body.mot_de_passe,
        role: req.body.role
      },
      {
        where: { id: req.params.id }
      }
    );
    res.json({ message: "Utilisateur modifié" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json(err);
  }
};