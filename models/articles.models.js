const db = require('../db/connection')

exports.selectArticleById = article_id => {
  return db
    .query(
      // couldn't get this to work with just count comments, so had to query the whole object
      `SELECT COUNT (comments.comment_id) AS comment_count, title, articles.article_id, articles.author, articles.body, topic, articles.created_at, articles.votes FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,

      [article_id]
    )
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' })
      }
      return article[0]
    })
}
