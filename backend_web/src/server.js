const app = require('./app');
const { Sequelize } = require('sequelize');
const transporter = require('./services/brevoService').transporter;
const db = require("./models");
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur lancé sur le port ${PORT}`)
  console.log("SERVER FILE :", __filename);
console.log("WORKING DIR :", process.cwd());;
});

// Vérifie la connexion SMTP au démarrage
transporter.verify((err) => {
  if (err) {
    console.error('Connexion Brevo échouée :', err.message);
  } else {
    console.log('Brevo SMTP prêt');
  }
});

db.sequelize.sync()
  .then(() => console.log("ORM Sequelize connected on PHP my admin MySQL"))
  .catch(err => console.log(err));