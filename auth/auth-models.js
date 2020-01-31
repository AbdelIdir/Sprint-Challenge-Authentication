const db = require("../database/dbConfig")


function addUser(user) {
  return db("users")
    .insert(user)
    .then(ids => ({ id: ids[0] }));
}



module.exports = {

    addUser
}