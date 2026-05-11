const app = require('./app');
const { Sequelize } = require('sequelize');
//const sequelize = require("./config/config");
const db = require("./models");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

db.sequelize.sync()
  .then(() => console.log("ORM Sequelize connected on Railway MySQL"))
  .catch(err => console.log(err));