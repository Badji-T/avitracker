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
const sync = require('./routes/syncRoutes');
const stats = require('./routes/statsRoute');

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
app.use('/api/sync', sync);
app.use('/api/stats', stats);

module.exports = app;