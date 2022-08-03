const {
  psqlErrors,
  customErrors,
  handleFiveHundreds,
  handle404,
} = require('./errors.js')
const { getTopics } = require('./controllers/topics.controllers')
const { getArticleById } = require('./controllers/articles.controllers')


const express = require('express')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)


app.use(psqlErrors)
app.use(customErrors)
app.use(handleFiveHundreds)
app.use(handle404)

module.exports = app
