const { Pool } = require('pg')

const pool = new Pool()
const query = (text, params, callback) => pool.query(text, params, callback)

module.exports = { query }
