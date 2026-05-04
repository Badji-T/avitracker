const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require("bcrypt");

const db = require('./db/database');
const user = require('./routes/userRoutes');
const lot = require('./routes/lotRoutes');
const espece = require('./routes/especeRoutes');
const depense = require('./routes/depenseRoutes');
const perte = require('./routes/perteRoutes');
const revenu = require('./routes/revenuRoutes');
const auth = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/users', user); 
app.use('/lots', lot);
app.use('/especes', espece);
app.use('/depenses', depense);
app.use('/pertes', perte);
app.use('/revenus', revenu);
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.send('API Avitracker OK');
});

app.get('/db', (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.send(err);
    res.send("API + DB OK ");
  });
});

module.exports = app;