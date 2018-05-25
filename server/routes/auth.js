const express = require('express')
const async = require('async')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const router = express.Router()

router.post('/signup', (req, res) => {
  const email = req.body.email
  const password = req.body.password
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
      res.json({ user: result.rows[0] })
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

})

module.exports = router
