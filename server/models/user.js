const Immutable = require('immutable')
const db = require('./database.js')
const config = require('../config')

const User = Immutable.Record({ id: null })

User.getByEmail = (email, done) => db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()], done)

User.create = (email, hash, done) => db.query('INSERT INTO public.users(email, hash, balance) VALUES ($1, $2, $3) RETURNING *;',
  [email.toLowerCase().replace(/\s+/g, ''), hash, config.initUSD], done)

module.exports = User

