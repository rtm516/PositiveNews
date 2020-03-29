const express = require('express')
const CurrentsAPI = require('currentsapi')
const fs = require('fs')

const router = express.Router()

const apiKey = '3bVjgioSJtX59a2MKl3beRcMSH6WtB6Z7kxadAa6bFumBdVb'
const currentsapi = new CurrentsAPI(apiKey)

const refreshTime = 500 * 60 * 1000 // 5 mins

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

//import {getSentiment} from "./node_nlp/routes/nlp.js";
function isPositiveArticle (article) {  
  return (getSentiment(article) < 0);
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
  /*
  res.json({
    success: true,
    news: { 'a348b30b-cebc-45d5-9bc1-b8767875604f': { title: 'North Korea launches apparent ballistic missiles into ocean', desc: 'SEOUL (Reuters) - North Korea fired what appeared to be two short-range ballistic missiles into the ocean off its east coast on Sunday, military officials in South Korea and Japan said, the latest in an unprecedented flurry of launches this month.\n\nTwo "short-range projectiles" were launched from th...', url: 'https://uk.reuters.com/article/uk-northkorea-missiles/north-korea-launches-apparent-ballistic-missiles-into-ocean-idUKKBN21F0Y0?il=0', date: '2020-03-29 00:02:02 +0000' } }
  })
  */

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
        if (!isSafeArticle(article)) { return }
        if (!isPositiveArticle(article)) { return }

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
