const { Depense, Lot, Espece } = require("../models");
const { Op } = require("sequelize");

const generateDepenseCode =
async (lotId) => {

    const lot =
        await Lot.findByPk(lotId,{
            include: Espece
        });

    const codeEspece =
        lot.Espece.code.substring(0,3);

    const date =
        new Date()
        .toISOString()
        .slice(0,10)
        .replace(/-/g,"");

    const prefix =
        `DEP-${codeEspece}-${date}`;

    const lastDepense =
        await Depense.findOne({
            where:{
                code:{
                    [Op.like]:
                    `${prefix}%`
                }
            },
            order:[
                ["code","DESC"]
            ]
        });

    let nextNumber = 1;

    if(lastDepense){

        nextNumber =
            parseInt(
                lastDepense.code
                .split("-")
                .pop()
            ) + 1;
    }

    return `${prefix}-${String(nextNumber).padStart(3,"0")}`;
};

module.exports = {
    generateDepenseCode
};