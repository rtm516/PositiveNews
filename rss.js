const express = require('express')
const { getNews } = require('./news')

const router = express.Router()

// The main news query route
router.get('/feed', function (req, res) {
  // Fetch the news
  getNews((data) => {
    if (data === undefined) { data = {} }

    // Build the static xml feed data
    let rssXML = ''
    rssXML += '<?xml version="1.0" ?>\n'
    rssXML += '<rss version="2.0">\n'
    rssXML += '\t<channel>\n'
    rssXML += '\t\t<title>Positive News</title>\n'
    rssXML += '\t\t<link>https://positive-news.glitch.me/</link>\n'
    rssXML += '\t\t<description>The latest postive news</description>\n'
    rssXML += '\t\t<language>en-gb</language>\n'
    rssXML += '\t\t<ttl>5</ttl>\n'

    // Fill in the items for each article
    Object.values(data).forEach(article => {
      rssXML += '\t\t<item>\n'
      rssXML += `\t\t\t<title>${article.title}</title>\n`
      rssXML += `\t\t\t<link>${article.url}</link>\n`
      rssXML += `\t\t\t<description>${article.desc}</description>\n`
      rssXML += `\t\t\t<pubDate>${new Date(article.date).toUTCString()}</pubDate>\n`
      rssXML += '\t\t</item>\n'
    })

    rssXML += '\t</channel>\n'
    rssXML += '</rss>'

    // Set the content type and send to the client
    res.set('Content-Type', 'text/xml')
    res.send(rssXML)
  })
})

// Default 404 route
router.get('*', function (req, res) {
  // Build the xml 404 page
  let xmlError = ''
  xmlError += '<?xml version="2.0" encoding="UTF-8" ?>\n'
  xmlError += '<response>\n'
  xmlError += '\t<success>false</success>\n'
  xmlError += '\t<message>Unknown request</message>\n'
  xmlError += '</response>'

  // Set the status code, content type and send to the client
  res.status(404).set('Content-Type', 'text/xml').send(xmlError)
})

module.exports = router
