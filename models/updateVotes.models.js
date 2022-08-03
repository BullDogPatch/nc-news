const db = require('../db/connection')

exports.updateVotes = async (article_id, votes) => {
  const { rows } = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [votes, article_id]
  )
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'Article not found' })
  }
  return rows[0]
}
