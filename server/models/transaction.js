const Immutable = require('immutable')
const db = require('./database.js')

const Tx = Immutable.Record({ id: null })

Tx.create = (userId, usd, amount, coinName, done) => db.query('INSERT INTO public.transactions("userId", "usd", "amount", "coinName", "time") VALUES ($1, $2, $3, $4, $5) RETURNING *;',
  [userId, usd, amount, coinName, new Date()], done)

Tx.getByUserId = (userId, done) => db.query('SELECT * FROM transactions WHERE "userId" = $1 ORDER BY id DESC', [userId], done)

module.exports = Tx

