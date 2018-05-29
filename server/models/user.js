const Immutable = require('immutable')
const db = require('./database.js')
const config = require('../config')

const User = Immutable.Record({ id: null })

User.getByEmail = (email, done) => db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()], done)

User.create = (email, hash, done) => db.query('INSERT INTO public.users(email, hash, balance) VALUES ($1, $2, $3) RETURNING *;',
  [email.toLowerCase().replace(/\s+/g, ''), hash, config.initUSD], done)

User.update = (userObj, priceId, done) => db.query(`UPDATE public.users SET balance = $1, "${priceId}" = $2 WHERE id = $3`,
  [userObj.balance, userObj[priceId], userObj.id], done)


module.exports = User

