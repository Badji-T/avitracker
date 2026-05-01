const db = require("../db/database");

const espece = {

  getAll(callback) {
    db.query(
      "SELECT * FROM espece WHERE deleted_at IS NULL",
      callback
    );
  },

  getById(id, callback) {
    db.query(
      "SELECT * FROM espece WHERE id=? AND deleted_at IS NULL",
      [id],
      callback
    );
  },

  create(data, callback) {
    db.query(
      `INSERT INTO espece (nom_espece, Description, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?)`,
      [data.nom_espece, data.Description, new Date(), new Date(), null],
      callback
    );
  },

  update(id, data, callback) {
    db.query(
      `UPDATE espece
       SET nom_espece=?, Description=?, updated_at=?
       WHERE id=?`,
      [data.nom_espece, data.Description, new Date(), id],
      callback
    );
  },

  delete(id, callback) {
    db.query(
      "UPDATE espece SET deleted_at=? WHERE id=?",
      [new Date(), id],
      callback
    );
  }

};

module.exports = espece;