const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User } = require("../models");
const { Op } = require("sequelize");

//SE CONNECTER
exports.login = (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/téléphone et mot de passe requis.' });
  }
  User.findOne({
    where: {
      [Op.or]: [
        { email: identifier },
        { tel: identifier }
      ]
    }
  }).then(user => {
    if (!user) {
      return res.status(401).json({ message: "Numéro ou Email incorrect" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json(err);

      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Generation de token JWT si elles sont valides. tokens cree vrifie dans authMiddleware.verifyToken().
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
          username: user.username,
          nom: user.nom,
          prenom: user.prenom,
          tel: user.tel,
          email: user.email,
          role: user.role
        }
      });
    })
  });
};


// S'INSCRIRE
exports.register = async (req, res) => {

  try {
    const {
      nom,
      prenom,
      username,
      tel,
      email,
      password
    } = req.body;


    // Vérification champs obligatoires
    if (!tel || !password) {
      return res.status(400).json({ message: "Numéro de téléphone et mot de passe requis." });
    }


    // Vérifier si utilisateur existe déjà
    const existingUser = await User.findOne({ where: { tel } });

    if (existingUser) {
      return res.status(400).json({
        message:
        "Ce numéro de téléphone est déjà utilisé."
      });
    }

    // Hasher mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Créer utilisateur
    const userData = {
      nom,
      prenom,
      username,
      tel,
      email,
      password: hash
    };

    await User.create(userData);

    res.status(201).json({ message: "Utilisateur créé" });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message
    });
  }
};