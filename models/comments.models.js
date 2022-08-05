const db = require('../db/connection')

exports.fetchComments = article_id => {
  return db
    .query(
      `
  SELECT *
  FROM articles
  WHERE article_id=$1;
  `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Article not found',
        })
      } else {
        return db
          .query(`SELECT * FROM comments where article_id = $1;`, [article_id])
          .then(({ rows }) => {
            return rows
          })
      }
    })
}

exports.addComment = (article_id, newComment) => {
  const { body, username } = newComment

  return db
    .query(
      'INSERT INTO comments (body, article_id, author) VALUES($1, $2, $3) RETURNING *;',
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0]
    })
}
