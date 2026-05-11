const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User } = require("../models");

//SE CONNECTER
exports.login = (req, res) => {
  const { tel, mot_de_passe } = req.body;

  if (!tel || !mot_de_passe) {
    return res.status(400).json({ message: 'Numéro de téléphone et mot de passe requis.' });
  }

  // Verifier si le user existe
  User.findOne({ where: { tel } }).then(user => {
    if (!user) {
      return res.status(401).json({ message: "Numéro incorrect" });
    }

    // Si le user existe, verifier le mot de passe
    const user = results[0];

    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
      if (err) return res.status(500).json(err);

      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Generation de token JWT si elles sont valides.
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { 
          algorithm: "HS256",
          expiresIn: process.env.JWT_EXPIRES 
        }
      );

      // Retourner le token et les infos du user
      res.json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role
        }
      });
    })
  });
};


// S'INSCRIRE
exports.register = (req, res) => {
  const { tel, mot_de_passe } = req.body;

  if (!tel || !mot_de_passe) {
    return res.status(400).json({ message: 'Numéro de téléphone et mot de passe requis.' });
  }

  db.query("SELECT * FROM users WHERE tel = ?", [tel], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "Ce numéro de téléphone est déjà utilisé." });
    }
  });
  
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