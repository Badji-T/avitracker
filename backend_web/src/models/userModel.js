const db = require("../db/database");

const User = {

  getAll(callback) {
    db.query(
      "SELECT * FROM users WHERE deleted_at IS NULL",
      callback
    );
  },

  getById(id, callback) {
    db.query(
      "SELECT * FROM users WHERE id=? AND deleted_at IS NULL",
      [id],
      callback
    );
  },

  create(data, callback) {
    db.query(
      `INSERT INTO users (nom, tel, role, created_at, updated_at, deleted_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [data.nom, data.tel, data.role, new Date(), new Date(), null],
      callback
    );
  },

  update(id, data, callback) {
    db.query(
      `UPDATE users
       SET nom=?, tel=?, role=?, updated_at=?
       WHERE id=?`,
      [data.nom, data.tel, data.role, new Date(), id],
      callback
    );
  },

  delete(id, callback) {
    db.query(
      "UPDATE users SET deleted_at=? WHERE id=?",
      [new Date(), id],
      callback
    );
  }

};

module.exports = User;