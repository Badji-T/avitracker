const { Espece } = require("../models");
const especeService = require("../services/especeServices");

// Liste des espèces
exports.getEspeces = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const especes = await Espece.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["created_at", "DESC"]],
    });

    res.json(especes);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Une espèce
exports.getEspece = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const espece = await Espece.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!espece) {
      return res.status(404).json({
        message: "Espèce introuvable",
      });
    }

    res.json(espece);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Création
exports.createEspece = async (req, res) => {
  try {
    console.log("req.user =", req.user);

    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const code = await especeService.generateCodeEspece(
      req.body.nom_espece
    );

    const espece = await Espece.create({
      user_id: req.user.id,
      nom_espece: req.body.nom_espece,
      code_espece: code,
      Description: req.body.Description || null,
    });

    res.status(201).json({
      message: "Espèce créée avec succès",
      espece,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Modification
exports.updateEspece = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const espece = await Espece.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!espece) {
      return res.status(404).json({
        message: "Espèce introuvable",
      });
    }

    await espece.update({
      nom_espece: req.body.nom_espece,
      Description: req.body.Description || null,
    });

    res.json({
      message: "Espèce modifiée avec succès",
      espece,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

// Suppression
exports.deleteEspece = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Utilisateur non authentifié",
      });
    }

    const espece = await Espece.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!espece) {
      return res.status(404).json({
        message: "Espèce introuvable",
      });
    }

    await espece.destroy();

    res.json({
      message: "Espèce supprimée avec succès",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};