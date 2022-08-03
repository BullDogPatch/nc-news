const db = require('../db/connection')

// exports.selectArticleById = article_id => {
//   return db
//     .query(
//       `
//     SELECT articles.*,
//     COUNT(comment_id) AS comment_count
//     FROM articles
//     LEFT JOIN comments
//     ON articles.article_id = comments.article_id
//     WHERE articles.article_id=$1
//     GROUP BY articles.article_id;`,
//       [article_id]
//     )
//     .then(result => {
//       console.log(result)

//       if (result.rows.length === 0) {
//         return Promise.reject({ status: 404, msg: 'Not Found' })
//       } else {
//         return result.rows[0]
//       }
//     })
// }

exports.selectArticleById = article_id => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(result => {
      if (result.rows.length) {
        return result.rows[0]
      } else {
        return Promise.reject({ status: 404, msg: 'Article not found' })
      }
    })
}
