const jwt = require("jsonwebtoken");
const { User } = require("../models");


const verifyToken = async (req, res, next) => {
    console.log("========== VERIFY TOKEN ==========");
    console.log("Authorization :", req.headers.authorization);

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token manquant" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded =", decoded);

        const user = await User.findByPk(decoded.id);

        console.log("User =", user);

        req.user = {
            id: user.id,
            role: user.role,
        };

        console.log("req.user =", req.user);

        next();
    } catch (e) {
        console.error(e);
        return res.status(403).json({ message: "Token invalide" });
    }
};

module.exports = verifyToken;