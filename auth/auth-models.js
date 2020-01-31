const db = require("../database/dbConfig");

function addUser(user) {
  return db("users")
    .insert(user)
    .then(ids => ({ id: ids[0] }));
}

function findByLog(filter_Username) {
  return db("users")
    .select("id", "username", "password")
    .where(filter_Username)
    .first();
}

module.exports = {
  addUser,
  findByLog
};
