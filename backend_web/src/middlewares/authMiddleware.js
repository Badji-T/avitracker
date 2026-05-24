const jwt = require("jsonwebtoken");

//VERIFIE SI TOKEN VALIDE
const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Accès refusé. Token manquant."
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(403).json({
                message: "Token invalide."
            });
        }

        req.user = decoded;

        next();
    });
};

module.exports = verifyToken;