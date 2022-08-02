const { psqlErrors, customErrors, handleFiveHundreds } = require('./errors.js')
const { getTopics } = require('./controllers/topics.controllers')

const express = require('express')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

// errors and custom errors

// app.all('*', (req, res) => {
//   res.status(404).send({ msg: 'Path not found' })
// })
app.use(psqlErrors)
app.use(customErrors)
app.use(handleFiveHundreds)

module.exports = app
