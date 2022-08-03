const db = require('../db/connection')

exports.updateVotes = async (article_id, votes) => {
  const { rows } = await db.query(
    `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`,
    [article_id, votes]
  )
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article not found' })
  }
  return rows[0]
}
