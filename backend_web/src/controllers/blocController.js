const { Bloc } = require("../models");

// Obtenir tous les blocs
exports.getBlocs = async (req, res) => {
  try {
    const blocs = await Bloc.findAll();
    res.status(200).json({ success: true, data: blocs });
  } catch (error) {
    res.status(500).json({
      success: false, message: "Erreur lors de la récupération des blocs", error: error.message});
  }
};

// Obtenir un seul bloc
exports.getBloc = async (req, res) => {
  try {
    const { id } = req.params;
    const bloc = await Bloc.findByPk(id);

    if (!bloc) {
      return res.status(404).json({ success: false, message: "Bloc introuvable"});
    }

    res.status(200).json({ success: true, data: bloc});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du bloc", error: error.message });
  }
};

// Créer un bloc
exports.createBloc = async (req, res) => {
  try {
    const {
      nom_bloc,
      nombre_de_lot
    } = req.body;

    const bloc = await Bloc.create({
      nom_bloc,
      nombre_de_lot
    });

    res.status(201).json({ success: true, message: "Bloc créé avec succès", data: bloc });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la création du bloc", error: error.message });
  }
};

// Modifier un bloc
exports.updateBloc = async (req, res) => {
  try {
    const { id } = req.params;

    const bloc = await Bloc.findByPk(id);

    if (!bloc) {
      return res.status(404).json({ success: false, message: "Bloc introuvable"});
    }

    await bloc.update(req.body);

    res.status(200).json({ success: true, message: "Bloc modifié avec succès", data: bloc });

  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur modification du bloc", error: error.message });
  }
};

// Supprimer un bloc (soft delete)
exports.deleteBloc = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bloc = await Bloc.findByPk(id);

    if (!bloc) {
      return res.status(404).json({ success: false, message: "Bloc introuvable" });
    }

    await bloc.destroy();

    res.status(200).json({ success: true, message: "Bloc supprimé avec succès" });

  } catch (error) {
    res.status(500).json({
      success: false, message: "Erreur lors de la suppression du bloc", error: error.message });
  }
};