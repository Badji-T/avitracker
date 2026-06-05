const { Lot, Depense, Perte, Revenu } = require("../models");
const lotService = require("./lotServices");
const { Op } = require("sequelize");


//CREATION CODE PERTE
const generatePerteCode = async (lotId) => {

    const lot =
            await Lot.findByPk(
                lotId,
                { include: Espece }
            );

        const codeEspece = lot.Espece.code.substring(0,3);

        const date =
            new Date()
            .toISOString()
            .slice(0,10)
            .replace(/-/g,"");

        const prefix = `PRT-${codeEspece}-${date}`;

        const lastPerte = await Perte.findOne({

                where:{
                    code_perte:{
                        [Op.like]: `${prefix}%`
                    }
                },

                order:[
                    ["code_perte","DESC"]
                ]
            });

        let nextNumber = 1;

        if(lastPerte){

            nextNumber =
                parseInt(
                    lastPerte.code_perte
                    .split("-")
                    .pop()
                ) + 1;
        }

        return `${prefix}-${String(nextNumber).padStart(3,"0")}`;
    };

//CREATION PERTE
const createPerte = async (data) => {

    const code_perte = await perteService.generatePerteCode(
        req.body.lot_id
    );

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
            code_perte,
            quantite,
            montant,
            cause,
            date_perte
        });

        return perte;

    }
};

module.exports = {
    generatePerteCode,
    createPerte
};

