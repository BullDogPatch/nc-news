const { fetchComments, addComment } = require('../models/comments.models')
const { selectArticleById } = require('../models/articles.models')

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params
  selectArticleById(article_id)
    .then(article => {
      if (article) {
        next
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' })
      }
    })
    .catch(err => {
      next(err)
    })

  fetchComments(article_id)
    .then(comments => {
      if (comments.length >= 0) {
        res.status(200).send({ comments })
      } else {
        return Promise.reject({ status: 404, msg: 'Not found' })
      }
    })
    .catch(err => {
      next(err)
    })
}

exports.postComment = (req, res, next) => {
  const { article_id } = req.params
  const body = req.body

  addComment(article_id, body)
    .then(comment => {
      console.log(comment)
      res.status(201).send({ comment })
    })
    .catch(next)
}
