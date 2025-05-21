const db = require("./db");

function getUserByEmail(email, callback) {
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0]);
  });
}

module.exports = { getUserByEmail };
