const { Pool } = require('pg')
const config = require('../config')

const pool = new Pool({ connectionString: config.db, })
const query = (text, params, callback) => pool.query(text, params, callback)

module.exports = { query }
