const {
  psqlErrors,
  customErrors,
  handleFiveHundreds,
  handle404,
} = require('./errors.js')
const { getTopics } = require('./controllers/topics.controllers')
const {
  getAllArticles,
  getArticleById,
} = require('./controllers/articles.controllers')
const {} = require('./controllers/articles.controllers')
const { getUsers } = require('./controllers/users.controllers') //
const { getVotes } = require('./controllers/getVotes.controllers')

const express = require('express')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/users', getUsers)

app.patch('/api/articles/:article_id', getVotes)

app.get('/api/articles', getAllArticles)

// errors
app.use(psqlErrors)
app.use(customErrors)
app.use(handleFiveHundreds)
app.use(handle404)

module.exports = app
