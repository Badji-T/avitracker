import User from "../models/User.js";
import PasswordReset from "../models/pwdReset.js";
import { generateResetToken } from "../services/tokenService.js";
import { sendResetEmail } from "../services/brevoService.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";

exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        // Toujours répondre la même chose
        if (!user) {
            return res.json({
                message:
                    "Si le compte existe, un email a été envoyé."
            });
        }

        const { token, tokenHash } =
            generateResetToken();

        await PasswordReset.destroy({
            where: {
                userId: user.id
            }
        });

        await PasswordReset.create({

            userId: user.id,

            tokenHash,

            expiresAt: new Date(
                Date.now() + 60 * 60 * 1000
            )

        });

        await sendResetEmail(
            user.email,
            token
        );

        return res.json({

            message:
                "Si le compte existe, un email a été envoyé."

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Erreur serveur"
        });

    }

};

exports.resetPassword = async (req, res) => {

    try {

        const { token, password } = req.body;

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const reset =
            await PasswordReset.findOne({

                where: {

                    tokenHash

                }

            });

        if (!reset) {

            return res.status(400).json({

                message:
                    "Lien invalide"

            });

        }

        if (reset.expiresAt < new Date()) {

            await reset.destroy();

            return res.status(400).json({

                message:
                    "Lien expiré"

            });

        }

        const user =
            await User.findByPk(reset.userId);

        if (!user) {

            return res.status(404).json({

                message:
                    "Utilisateur introuvable"

            });

        }

        user.password =
            await bcrypt.hash(password, 12);

        await user.save();

        await PasswordReset.destroy({

            where: {

                userId: user.id

            }

        });

        return res.json({

            message:
                "Mot de passe modifié avec succès."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            message:
                "Erreur serveur"

        });

    }

};