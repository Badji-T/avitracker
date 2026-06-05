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
const vente = require('./routes/venteRoutes');
const bloc = require('./routes/blocRoutes');
const auth = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/users', user); 
app.use('/api/lots', lot);
app.use('/api/especes', espece);
app.use('/api/depenses', depense);
app.use('/api/pertes', perte);
app.use('/api/ventes', vente);
app.use('/api/blocs', bloc);
app.use('/api/auth', auth);

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