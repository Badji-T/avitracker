const db = require("../db/database");

const depense = {

  getAll(callback) {
    db.query(
      "SELECT * FROM depense WHERE deleted_at IS NULL",
      callback
    );
  },

  getById(id, callback) {
    db.query(
      "SELECT * FROM depense WHERE id=? AND deleted_at IS NULL",
      [id],
      callback
    );
  },

  create(data, callback) {
    db.query(
      `INSERT INTO depense (lot_id, type_depense, montant, date_depense, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.lot_id, data.type_depense, data.montant, data.date_depense, new Date(), new Date(), null],
      callback
    );
  },

  update(id, data, callback) {
    db.query(
      `UPDATE depense
       SET lot_id=?, type_depense=?, montant=?, date_depense=?, updated_at=?
       WHERE id=?`,
      [data.lot_id, data.type_depense, data.montant, data.date_depense, new Date(), id],
      callback
    );
  },

  delete(id, callback) {
    db.query(
      "UPDATE depense SET deleted_at=? WHERE id=?",
      [new Date(), id],
      callback
    );
  }

};

module.exports = depense;