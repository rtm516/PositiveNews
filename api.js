const express = require('express')
const CurrentsAPI = require('currentsapi')
const fs = require('fs')
const nlp = require('./nlp')

const router = express.Router()

const apiKey = '3bVjgioSJtX59a2MKl3beRcMSH6WtB6Z7kxadAa6bFumBdVb'
const currentsapi = new CurrentsAPI(apiKey)

const refreshTime = 5 * 60 * 1000 // 5 mins

const badWords = [
  'coronavirus',
  'corona virus',
  'lockdown',
  'isolation',
  'isolating',
  'quarantine',
  'assault'
]

function isSafeArticle (article) {
  let found = false
  badWords.forEach(word => {
    if ((article.title.toLowerCase().indexOf(word) > -1) || (article.description.toLowerCase().indexOf(word) > -1)) {
      found = true
    }
  })

  return !found
}

function isPositiveArticle (article) {
  return (getSentiment(article.title) <= 0) && (getSentiment(article.description) <= 0)
}

function cacheUptoDate () {
  if (fs.existsSync('cache.json')) {
    const cache = fs.statSync('cache.json')
    if (cache.isFile() && (Date.now() - cache.ctimeMs) < refreshTime) {
      return true
    }
  }

  return false
}

router.get('/query', function (req, res) {
  if (cacheUptoDate()) {
    console.log('Loading news from cache')
    res.json({
      success: true,
      news: JSON.parse(fs.readFileSync('cache.json', 'utf8') || {})
    })

    return
  }

  console.log('Updating news')
  currentsapi.search({
    language: 'en',
    country: 'GB'
  }).then(response => {
    if (response.status === 'ok') {
      const safeNews = {}

      response.news.forEach(article => {
        if (article.language !== 'en') { return }

        const positiveArticle = isPositiveArticle(article)
        if (!isSafeArticle(article) && !positiveArticle) { return }
        if (!positiveArticle) { return }

        const tmpNews = {}
        tmpNews.title = article.title
        tmpNews.desc = article.description
        tmpNews.url = article.url
        tmpNews.date = article.published

        safeNews[article.id] = tmpNews
      })

      fs.writeFile('cache.json', JSON.stringify(safeNews), () => {})

      res.json({
        success: true,
        news: safeNews
      })
    } else {
      res.json({
        success: false,
        message: 'An unknown error occured'
      })
    }
  })
})

router.get('*', function (req, res) {
  res.status(404).json({
    success: false,
    message: 'Unknown API'
  })
})

module.exports = router
