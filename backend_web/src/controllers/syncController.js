const {Lot, Vente, Depense, Perte, Espece,} = require("../models");

// Restauration des données de l'utilisateur
exports.download = async (req, res) => {
  try {
    const user_id = req.user.id;

    const lots = await Lot.findAll({
      where: { user_id: user_id },
    });

    const lotIds = lots.map(lot => lot.id);

    const ventes = await Vente.findAll({
      where: {
        lot_id: lotIds
      }
    });

    const depenses = await Depense.findAll({
      where: {
        lot_id: lotIds
      }
    });

    const pertes = await Perte.findAll({
      where: {
        lot_id: lotIds
      }
    });

    res.status(200).json({
      success: true,
      backupDate: new Date(),
      lots: lots,
      depenses: depenses,
      pertes: pertes,
      ventes: ventes
    });

  } catch (error) {
    console.error("Erreur backup :", error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la sauvegarde"
    });
  }
};

// Enregistrement des données de l'utilisateur (upsert : insert ou update selon l'existence de l'id)
exports.upload = async (req, res) => {

  try {

    const userId = req.user.id;

      const {
        lots = [],
        ventes = [],
        depenses = [],
        pertes = []
      } = req.body;

      for (const lot of lots) {
        await Lot.upsert({
          ...lot,
          user_id: userId
        });
      }

      for (const vente of ventes) {
        await Vente.upsert(vente);
      }
      
      for (const depense of depenses) {
        await Depense.upsert(depense);
      }

      for (const perte of pertes) {
        await Perte.upsert(perte);
      }

      return res.status(200).json({
        success: true,
        message: "Synchronisation réussie"
      });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Erreur de synchronisation"
    });

  }

};