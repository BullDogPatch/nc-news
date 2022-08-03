exports.psqlErrors = (err, req, res, next) => {
  if (err.code === '22P02' || err.code === '23502') {
    res.status(400).send({ msg: 'bad request' })
  } else next(err)
}

exports.customErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else next(err)
}

exports.handleFiveHundreds = (err, req, res, next) => {
  res.status(500).send({ msg: 'Server error' })
}

exports.handle404 = (req, res) => {
  res.status(404).send({ msg: 'Not Found' })
}
