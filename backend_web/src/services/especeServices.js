const { Espece } = require("../models");
const { Op } = require("sequelize");

const generateCodeEspece = async (nomEspece) => {

    const words = nomEspece
        .trim()
        .toUpperCase()
        .split(/\s+/);

    let prefix = "";

    if (words.length === 1) {

        prefix = words[0].substring(0, 3);

    } else {

        prefix = words
            .map(word => word[0])
            .join("");
    }

    const lastEspece = await Espece.findOne({

        where: {
            code_espece: {
                [Op.like]: `${prefix}%`
            }
        },

        order: [["code_espece", "DESC"]]
    });

    let nextNumber = 1;

    if (lastEspece) {

        const lastCode = lastEspece.code_espece;

        const numericPart =
            parseInt(lastCode.slice(prefix.length));

        nextNumber = numericPart + 1;
    }

    return (
        prefix +
        String(nextNumber).padStart(3, "0")
    );
};

module.exports = {
    generateCodeEspece
};