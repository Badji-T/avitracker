const db = require("../db/database");

const revenu = {

  getAll(callback) {
    db.query(
      "SELECT * FROM revenu WHERE deleted_at IS NULL",
      callback
    );
  },

  getById(id, callback) {
    db.query(
      "SELECT * FROM revenu WHERE id=? AND deleted_at IS NULL",
      [id],
      callback
    );
  },

  create(data, callback) {
    db.query(
      `INSERT INTO revenu (lot_id, quantite_vendue, montant_total, date_vente, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.lot_id, data.quantite_vendue, data.montant_total, data.date_vente, new Date(), new Date(), null],
      callback
    );
  },

  update(id, data, callback) {
    db.query(
      `UPDATE revenu
       SET lot_id=?, quantite_vendue=?, montant_total=?, date_vente=?, updated_at=?
       WHERE id=?`,
      [data.lot_id, data.quantite_vendue, data.montant_total, data.date_vente, new Date(), id],
      callback
    );
  },

  delete(id, callback) {
    db.query(
      "UPDATE revenu SET deleted_at=? WHERE id=?",
      [new Date(), id],
      callback
    );
  }

};

module.exports = revenu;