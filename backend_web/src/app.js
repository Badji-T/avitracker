const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const db = require('./db/database');
const user = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/users', user); 

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