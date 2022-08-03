const db = require('../db/connection')

// fetchUsers
exports.fetchUsers = () => {
  return db
    .query(
      `
    SELECT *
    FROM users;
    `
    )
    .then(({ rows }) => {
      return rows
    })
}
