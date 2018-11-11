const Immutable = require('immutable')
const db = require('./database.js')
const config = require('../config')

const User = Immutable.Record({ id: null })

User.getByEmail = (email, done) => db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()], done)

User.create = (email, hash, country_code, first_name, last_name, is_attorney, status, done) => db.query('INSERT INTO public.users(email, hash, country_code, first_name, last_name, is_attorney, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
  [email.toLowerCase().replace(/\s+/g, ''), hash, country_code, first_name, last_name, is_attorney, status], done)

module.exports = User
