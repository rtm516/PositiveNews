const express = require('express')
const CurrentsAPI = require('currentsapi')
const router = express.Router()

const apiKey = '3bVjgioSJtX59a2MKl3beRcMSH6WtB6Z7kxadAa6bFumBdVb'
const currentsapi = new CurrentsAPI(apiKey)

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

router.get('/query', function (req, res) {
  res.json({
    success: true,
    news: { 'a348b30b-cebc-45d5-9bc1-b8767875604f': { title: 'North Korea launches apparent ballistic missiles into ocean', desc: 'SEOUL (Reuters) - North Korea fired what appeared to be two short-range ballistic missiles into the ocean off its east coast on Sunday, military officials in South Korea and Japan said, the latest in an unprecedented flurry of launches this month.\n\nTwo "short-range projectiles" were launched from th...', url: 'https://uk.reuters.com/article/uk-northkorea-missiles/north-korea-launches-apparent-ballistic-missiles-into-ocean-idUKKBN21F0Y0?il=0', date: '2020-03-29 00:02:02 +0000' } }
  })
  
  /*
  currentsapi.search({
    language: 'en',
    country: 'GB'
  }).then(response => {
    if (response.status === 'ok') {
      const safeNews = {}

      response.news.forEach(article => {
        if (!isSafeArticle(article)) { return }

        const tmpNews = {}
        tmpNews.title = article.title
        tmpNews.desc = article.description
        tmpNews.url = article.url
        tmpNews.date = article.published

        safeNews[article.id] = tmpNews
      })

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
  */
})

router.get('*', function (req, res) {
  res.status(404).json({
    success: false,
    message: 'Unknown API'
  })
})

module.exports = router
