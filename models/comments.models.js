const db = require('../db/connection')

exports.fetchComments = article_id => {
  return db
    .query(
      `SELECT  
  comments.comment_id,
  comments.votes, 
  comments.created_at,
  comments.author,
  comments.body
  FROM comments
  INNER JOIN articles ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1; `,
      [article_id]
    )
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
