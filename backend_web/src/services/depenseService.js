const { Depense, Lot, Espece } = require("../models");
const { Op } = require("sequelize");

const generateDepenseCode =
async (lotId) => {

    const lot =
        await Lot.findByPk(lotId, {
            include: [
                {
                    model: Espece,
                    as: "espece"
                }
            ]
        });

    if (!lot) {
        throw new Error("Lot introuvable");
    }

    const codeEspece =
        lot.espece.code_espece.substring(0, 3);

    const now = new Date();

    const date =
        `${String(now.getDate()).padStart(2, "0")}` +
        `${String(now.getMonth() + 1).padStart(2, "0")}` +
        `${now.getFullYear()}`;

    const prefix =
        `DEP-${codeEspece}-${date}`;

    const lastDepense =
        await Depense.findOne({
            where:{
                code_depense:{
                    [Op.like]:
                    `${prefix}%`
                }
            },
            order:[
                ["code_depense","DESC"]
            ]
        });

    let nextNumber = 1;

    if(lastDepense){

        nextNumber =
            parseInt(
                lastDepense.code_depense
                .split("-")
                .pop()
            ) + 1;
    }

    return `${prefix}-${String(nextNumber).padStart(3,"0")}`;
};

module.exports = {
    generateDepenseCode
};
