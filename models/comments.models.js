const db = require('../db/connection')

exports.fetchCommentsByArticleId = article_id => {
  return db
    .query('SELECT * FROM comments where article_id = $1;', [article_id])
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article not found`,
        })
      }
      return article
    })
}
