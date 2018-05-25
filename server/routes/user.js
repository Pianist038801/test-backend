const express = require('express')

const router = express.Router()

router.use((req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(403).json({ err: 'Authorization error' })
  }
})

module.exports = router
