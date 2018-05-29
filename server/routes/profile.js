const express = require('express')
const CoinMarketCap = require('node-coinmarketcap')
const coins = require('../config/coins.json')
const User = require('../models/user')

const coinmarketcap = new CoinMarketCap()

const router = express.Router()

router.use((req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(403).json({ err: 'Authorization error' })
  }
})

router.get('/prices', (req, res) => {
  coinmarketcap.multi((allCoins) => {
    const result = allCoins.data.filter(
      oneData => (coins.find(coin => coin.id === oneData.id)) !== undefined
    )
    res.json(result)
  })
})

router.post('/buy-coin', (req, res) => {
  const { amount } = req.body
  coinmarketcap.get(req.body.price.id, (price) => {
    const newBalance = req.user.balance - (price.price_usd * amount)
    if (newBalance < 0) {
      res.json({ err: 'Do not have enough money' })
      return
    }
    req.user.balance = newBalance
    req.user[price.id] += amount

    User.update(req.user, price.id, (err) => {
      if (err) {
        res.json({ err: 'DB update error' })
      } else {
        res.json({ user: req.user })
      }
    })
  })
})

module.exports = router
