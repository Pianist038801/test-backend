const config = {
  secret    : 'aef7l32jh2oi32jfh23io',
  expiresIn : '10h',
  initUSD   : 10000,
  db        : process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/pianist'
}

module.exports = config
