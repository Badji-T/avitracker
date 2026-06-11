const app = require('./app');
const { Sequelize } = require('sequelize');
const transporter = require('./services/brevoService').transporter;
const db = require("./models");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
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