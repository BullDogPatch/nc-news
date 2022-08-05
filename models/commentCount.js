exports.commentCount = () => {
  return `SELECT COUNT (comments.comment_id) AS comment_count, title, articles.article_id, articles.author, articles.body, topic, articles.created_at, articles.votes FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`
}
