const db = require("../db/database");

const lot = {

  getAll(callback) {
    db.query(
      "SELECT * FROM lot WHERE deleted_at IS NULL",
      callback
    );
  },

  getById(id, callback) {
    db.query(
      "SELECT * FROM lot WHERE id=? AND deleted_at IS NULL",
      [id],
      callback
    );
  },

  create(data, callback) {
    db.query(
      `INSERT INTO lot (nom_lot, user_id, espece_id, quantite_initiale, date_arrivee, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.nom_lot, data.user_id, data.espece_id, data.quantite_initiale, data.date_arrivee, new Date(), new Date(), null],
      callback
    );
  },

  update(id, data, callback) {
    db.query(
      `UPDATE lot
       SET nom_lot=?, user_id=?, espece_id=?, quantite_initiale=?, date_arrivee=?, updated_at=?
       WHERE id=?`,
      [data.nom_lot, data.user_id, data.espece_id, data.quantite_initiale, data.date_arrivee, new Date(), id],
      callback
    );
  },

  delete(id, callback) {
    db.query(
      "UPDATE lot SET deleted_at=? WHERE id=?",
      [new Date(), id],
      callback
    );
  }

};

module.exports = lot;