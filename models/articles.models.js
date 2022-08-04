const db = require('../db/connection')
const { commentCount } = require('./commentCount')

exports.fetchAllArticles = async () => {
  const articles = await db.query(
    `SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id ORDER BY created_at DESC`
  )
  const { rows } = articles
  return rows
}

exports.selectArticleById = article_id => {
  return db
    .query(
      commentCount(),

      [article_id]
    )
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' })
      }
      return article[0]
    })
}
