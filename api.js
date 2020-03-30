const express = require('express')
const { getNews } = require('./news')

const router = express.Router()

// The main news query route
router.get('/query', function (req, res) {
  // Fetch the news
  getNews((data) => {
    if (data === undefined || data === {}) {
      // We got no data so send an error to the client
      res.json({
        success: false,
        message: 'An unknown error occured'
      })
    } else {
      // Send the client the latest data
      res.json({
        success: true,
        news: data
      })
    }
  })
})

// Default 404 route
router.get('*', function (req, res) {
  res.status(404).json({
    success: false,
    message: 'Unknown API'
  })
})

module.exports = router
