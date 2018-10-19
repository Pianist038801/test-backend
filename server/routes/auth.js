const express = require('express')
const async = require('async')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../config')

const router = express.Router()

router.post('/signup', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log('SignUp Request Body=');
  console.log(req.body);
  async.waterfall([
    (done) => {
      if (email.length === 0 || password.length === 0) {
        done('Invalid email or password')
      } else {
        done(null)
      }
    },
    (done) => {
      User.getByEmail(email, done)
    },
    (result, done) => {
      if (result.rows.length === 0) {
        bcrypt.genSalt(10, done)
      } else {
        done('Email already exists')
      }
    },
    (salt, done) => {
      bcrypt.hash(password, salt, done)
    },
    (hash, done) => {
      User.create(email, hash, done)
    },
    (result) => {
      const token = jwt.sign(result.rows[0], config.secret, { expiresIn: config.expiresIn })
      res.json({
        token,
        user: result.rows[0]
      })
    },
  ],
  (err) => {
    console.log('Signup error:', err)
    res.json({ err: 'Can not signup' })
  })
})

router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  async.waterfall([
    (done) => {
      User.getByEmail(email, done)
    },
    (result, done) => {
      if (result.rows.length !== 0) {
        bcrypt.compare(password, result.rows[0].hash, (err, isValid) => {
          done(isValid === true ? null : 'Wrong password', result.rows[0])
        })
      } else {
        done('Email does not exist')
      }
    },
    (userObj) => {
      const token = jwt.sign(userObj, config.secret, { expiresIn: config.expiresIn })
      res.json({
        token,
        user: userObj
      })
    },
  ],
  (err) => {
    console.log('Login error:', err)
    res.json({ err: 'Invalid email or password' })
  })
})

router.get('/check-token', (req, res) => {
  if (req.user) {
    const token = jwt.sign(req.user, config.secret, { expiresIn: config.expiresIn })
    res.json({
      authorized : true,
      token,
      user       : req.user
    })
  } else {
    res.json({ authorized: false })
  }
})

module.exports = router
