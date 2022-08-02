const db = require('../db/connection')

exports.updateVotes = async (article_id, votes) => {
  const {
    rows: [items],
  } = await db.query(
    `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`,
    [article_id, votes]
  )
  return items
}
