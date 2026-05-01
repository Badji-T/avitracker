const db = require("../db/database");

const perte = {

  getAll(callback) {
    db.query(
      "SELECT * FROM perte WHERE deleted_at IS NULL",
      callback
    );
  },

  getById(id, callback) {
    db.query(
      "SELECT * FROM perte WHERE id=? AND deleted_at IS NULL",
      [id],
      callback
    );
  },

  create(data, callback) {
    db.query(
      `INSERT INTO perte (lot_id, quantite, montant, cause, date_perte, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.lot_id, data.quantite, data.montant, data.cause, data.date_perte, new Date(), new Date(), null],
      callback
    );
  },

  update(id, data, callback) {
    db.query(
      `UPDATE perte
       SET lot_id=?, quantite=?, montant=?, cause=?, date_perte=?, updated_at=?
       WHERE id=?`,
      [data.lot_id, data.quantite, data.montant, data.cause, data.date_perte, new Date(), id],
      callback
    );
  },

  delete(id, callback) {
    db.query(
      "UPDATE perte SET deleted_at=? WHERE id=?",
      [new Date(), id],
      callback
    );
  }

};

module.exports = perte;