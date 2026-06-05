const { Lot, Depense, Perte, Vente, Espece } = require("../models");
const { Op } = require("sequelize");

//GENERATION DU CODE DU LOT
const generateLotCode = async (especeId) => {

    const espece =
        await Espece.findByPk(especeId);

    if (!espece) {
        throw new Error("Espèce introuvable");
    }

    const codeEspece =
        espece.code_espece.substring(0, 3);

    const date =
        new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    const prefix =
        `LOT-${codeEspece}-${date}`;

    const lastLot =
        await Lot.findOne({
            where: {
                code_lot: {
                    [Op.like]:
                    `${prefix}%`
                }
            },
            order: [["code_lot", "DESC"]]
        });

    let nextNumber = 1;

    if (lastLot) {

        const lastPart =
            lastLot.code_lot
            .split("-")
            .pop();

        nextNumber =
            parseInt(lastPart) + 1;
    }

    return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
};

//COUT TOTAL
const calculCoutTotal = async (lotId) => {

    // Somme des depenses
    const totalDepenses = await Depense.sum("montant", {
        where: { lot_id: lotId }
    });

    // Somme des pertes
    const totalPertes = await Perte.sum("montant", {
        where: { lot_id: lotId }
    });

    return (totalDepenses || 0) + (totalPertes || 0);
};

//REVENU TOTAL
const calculRevenuTotal = async (lotId) => {

    const totalRevenue = await Vente.sum("montant_total", {
        where: { lot_id: lotId }
    });

    return totalRevenue || 0;
};


//QUANTITE RESTANTE
const calculQuantiteRestante = async (lotId) => {

    // Recuperer le lot
    const lot = await Lot.findByPk(lotId);

    if (!lot) {
        throw new Error("Lot introuvable");
    }

    // Total pertes
    const totalLost = await Perte.sum("quantite", {
        where: { lot_id: lotId }
    });

    // Total vendus
    const totalSold = await Vente.sum("quantite_vendue", {
        where: { lot_id: lotId }
    });

    const remaining =
        lot.quantite_initiale - (totalLost || 0) - (totalSold || 0);

    return remaining;
};

const calculCoutMoyenVolaille = async (lotId) => {

    // Recuperer le lot
    const lot = await Lot.findByPk(lotId);

    if (!lot) {
        throw new Error("Lot introuvable");
    }

    // Cout total du lot
    const coutTotal = await calculCoutTotal(lotId);

     // Quantite initiale
    const quantiteInitiale = lot.quantite_initiale;

    // Cout moyen par volaille
    const coutMoyen = coutTotal / quantiteInitiale;

    return coutMoyen;
};


//CALCUL BENEFICE
const calculBenefice = async (lotId) => {

    const totalCost = await calculCoutTotal(lotId);

    const totalRevenue = await calculRevenuTotal(lotId);

    if (totalRevenue - totalCost < 0) {

        return 0; // Pas de bénéfice si perte
        
    } else{

        return totalRevenue - totalCost;
    }
};

//RESUME LOT
const getLotSummary = async (lotId) => {

    const totalCost = await calculCoutTotal(lotId);

    const totalRevenue = await calculRevenuTotal(lotId);

    const profit = await calculBenefice(lotId);

    const remainingQuantity = await calculQuantiteRestante(lotId);

    const coutMoyen = await calculCoutMoyenVolaille(lotId);

    return {
        cout_total: totalCost,
        revenu_total: totalRevenue,
        cout_moyen_par_volaille: coutMoyen,
        benefice: profit,
        quantite_restante: remainingQuantity
    };
};

module.exports = {
    generateLotCode,
    calculCoutTotal,
    calculRevenuTotal,
    calculBenefice,
    calculQuantiteRestante,
    calculCoutMoyenVolaille,
    getLotSummary
};