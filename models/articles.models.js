const db = require('../db/connection')

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
      `SELECT COUNT (comments.comment_id) AS comment_count, title, articles.article_id, articles.author, articles.body, topic, articles.created_at, articles.votes FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,

      [article_id]
    )
    .then(({ rows: article }) => {
      if (article.length === 0 || article === undefined) {
        return Promise.reject({ status: 404, msg: 'Article not found' })
      }
      return article[0]
    })
}
