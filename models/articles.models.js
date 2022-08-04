const db = require('../db/connection')

exports.fetchAllArticles = () => {
  return db
    .query(
      'SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id ORDER BY created_at DESC'
    )
    .then(({ rows }) => {
      return rows
    })
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
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' })
      }
      return article[0]
    })
}

// Responds with:

// an array of comments for the given article_id of which each comment should have the following properties:
// comment_id
// votes
// created_at
// author which is the username from the users table
// body

// exports.fetchCommentsByArticleId = async article_id => {
//   const comments = await db
//     .query('SELECT * FROM comments WHERE article_id = $1', [article_id])
//     .then(({ rows }) => {
//       console.log(rows)
//       return rows
//     })
//     .catch(err => {
//       console.log(err)
//     })
//   return comments
// }

exports.fetchCommentsByArticleId = async article_id => {
  const { rows } = await db.query(
    `
    SELECT *
    FROM comments
    WHERE article_id=$1;
    `,
    [article_id]
  )

  return rows
}
