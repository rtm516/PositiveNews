const https = require('https')
const fs = require('fs')

// The time the cache is kept for
// with 600 api req a day it can be as low as 2.4 mins
const refreshTime = 5 * 60 * 1000 // 5 mins

// Check if the cache is younger than refreshTime
function cacheUptoDate () {
  if (fs.existsSync('cache_reddit.json')) {
    const cache = fs.statSync('cache_reddit.json')
    if (cache.isFile() && (Date.now() - cache.mtimeMs) < refreshTime) {
      return true
    }
  }

  return false
}

// Check if an article is positive and pulling over only infomation we need
function cleanArticle (article, safeNews) {
  if (safeNews[article.name] !== undefined) { return }

  const redditLink = 'https://reddit.com' + article.permalink

  const tmpNews = {}
  tmpNews.title = article.title
  tmpNews.desc = '<a class="reddit" href="https://reddit.com' + article.permalink + '">Provided by reddit on r/UpliftingNews</a>'
  tmpNews.url = article.url
  tmpNews.date = new Date(article.created_utc * 1000).toString()

  safeNews[article.name] = tmpNews
}

module.exports.getReddit = function (callback) {
  if (cacheUptoDate()) {
    // If the cache is recent enough return that insted of refreshing
    console.log('Loading reddit from cache')

    callback(JSON.parse(fs.readFileSync('cache_reddit.json', 'utf8') || {}))

    return
  }

  // Get the latest news because the cache is old/missing
  console.log('Updating reddit')

  https.get('https://www.reddit.com/search/.json?q=subreddit%3AUpliftingNews&sort=new', (resp) => {
    let data = ''

    // Collect all data and append it together
    resp.on('data', (chunk) => {
      data += chunk
    })

    // We have all the data
    resp.on('end', () => {
      const safeNews = {}

      JSON.parse(data).data.children.forEach(article => {
        cleanArticle(article.data, safeNews)
      })

      // Write the latest safe news to the cache
      fs.writeFile('cache_reddit.json', JSON.stringify(safeNews), () => {})

      // Send the new safe news to the client
      callback(safeNews)
    })
  }).on('error', (err) => {
    if (err) {} // Stop standardjs complaining
    callback()
  })
}
