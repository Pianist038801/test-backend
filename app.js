const express      = require('express')
const path         = require('path')
const logger       = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const fs           = require('fs')
const join         = require('path').join
const cors         = require('cors')
const jwt          = require('jsonwebtoken')
const config       = require('./config')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }))
app.use(cookieParser())
app.use('/static', express.static(path.join(__dirname, 'static')))

app.use((req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err == null) {
        req.user = decoded
      }
      next()
    })
  } else {
    next()
  }
})

/* eslint-disable */
const routes = join(__dirname, 'server/routes')

fs.readdirSync(routes)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => {
    const routeName = file.split('.')[0]
    app.use(`/${routeName}`, require(join(routes, file)) )
  })
/* eslint-enable */

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers
app.use((err, req, res) => {
  res.status(err.status || 500)
  res.json({
    message : err.message,
    error   : err
  })
})

module.exports = app
