const verifyRoles = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Vous n'avez pas les permissions."
            });
        }

        next();
    };
};

/*
// Exemple d'utilisation dans une route

const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    deleteAvion
);
*/

module.exports = verifyRoles;