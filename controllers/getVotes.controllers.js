const { updateVotes } = require('../models/updateVotes.models')

exports.getVotes = (req, res, next) => {
  const articleID = req.params.article_id
  const votes = req.body.inc_votes
  updateVotes(articleID, votes)
    .then(article => {
      res.status(200).send({
        article,
      })
    })
    .catch(next)
}
