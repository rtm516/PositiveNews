const CurrentsAPI = require('currentsapi')
const fs = require('fs')
const { getSentiment } = require('./nlp')

// Setup the news api using https://www.currentsapi.services/
const apiKey = '3bVjgioSJtX59a2MKl3beRcMSH6WtB6Z7kxadAa6bFumBdVb'
const currentsapi = new CurrentsAPI(apiKey)

// The time the cache is kept for
// with 600 api req a day it can be as low as 2.4 mins
const refreshTime = 5 * 60 * 1000 // 5 mins

// The list of words to run extra checks on
const badWords = [
  'coronavirus',
  'corona virus',
  'lockdown',
  'isolation',
  'isolating',
  'quarantine',
  'assault'
]

// Check if the article has any bad words in
function isSafeArticle (article) {
  let found = false
  badWords.forEach(word => {
    if ((article.title.toLowerCase().indexOf(word) > -1) || (article.description.toLowerCase().indexOf(word) > -1)) {
      found = true
    }
  })

  return !found
}

// Work out based on NLP if the article is positive
function isPositiveArticle (article, neutral = 0) {
  return (getSentiment(article.title) >= neutral) && (getSentiment(article.description) >= neutral)
}

// Check if the cache is younger than refreshTime
function cacheUptoDate () {
  if (fs.existsSync('cache.json')) {
    const cache = fs.statSync('cache.json')
    if (cache.isFile() && (Date.now() - cache.ctimeMs) < refreshTime) {
      return true
    }
  }

  return false
}

module.exports.getNews = function (callback) {
  if (cacheUptoDate()) {
    // If the cache is recent enough return that insted of refreshing
    console.log('Loading news from cache')

    callback(JSON.parse(fs.readFileSync('cache.json', 'utf8') || {}))

    return
  }

  // Get the latest news because the cache is old/missing
  console.log('Updating news')
  currentsapi.search({
    language: 'en',
    country: 'GB'
  }).then(response => {
    if (response.status === 'ok') {
      const safeNews = {}

      // Loop through each article checking its positive and pulling over only infomation we need
      response.news.forEach(article => {
        if (article.language !== 'en') { return }

        // If article is deemed unsafe, raise neutrality bar
        const safeArticle = isSafeArticle(article)
        const neutral = safeArticle ? 0 : 0.25

        // If article is deemed negative, discard
        if (!isPositiveArticle(article, neutral)) { return }

        const tmpNews = {}
        tmpNews.title = article.title
        tmpNews.desc = article.description
        tmpNews.url = article.url
        tmpNews.date = new Date(article.published).toString()

        safeNews[article.id] = tmpNews
      })

      // Write the latest safe news to the cache
      fs.writeFile('cache.json', JSON.stringify(safeNews), () => {})

      // Send the new safe news to the client
      callback(safeNews)
    } else {
      // We got a bad status code so send an error to the client
      callback()
    }
  })
}
