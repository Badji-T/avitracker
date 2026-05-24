const { Lot, Depense, Perte, Revenu } = require("../models");
const lotService = require("./lotServices");

 const createPerte = async (data) => {

    const {
        lot_id,
        quantite,
        cause,
        date_perte
    } = data;

    // Recuperer le lot
    const lot = await Lot.findByPk(lot_id);

    if (!lot) {
        throw new Error("Lot introuvable");
    }

    if (quantite > await lotService.calculQuantiteRestante(lot_id)) {
        throw new Error("Quantité de perte dépasse le stock disponible");
    } else {

        // Calcul cout moyen
        const coutMoyen = await lotService.calculCoutMoyenVolaille(lot_id);

        // Calcul montant perte
        const montant = quantite * coutMoyen;

        // Creer perte
        const perte = await Perte.create({
            lot_id,
            quantite,
            montant,
            cause,
            date_perte
        });

        return perte;

    }
};

