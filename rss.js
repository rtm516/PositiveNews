const express = require('express')
const { getNews } = require('./news')

const router = express.Router()

// The main news query route
router.get('/feed', function (req, res) {
  // Fetch the news
  getNews((data) => {
    if (data === undefined) { data = {} }

    let rssXML = ''
    rssXML += '<?xml version="1.0" ?>'
    rssXML += '<rss version="2.0">'
    rssXML += '<channel>'
    rssXML += '<title>Positive News</title>'
    rssXML += '<link>https://positive-news.glitch.me/</link>'
    rssXML += '<description>The latest postive news</description>'
    rssXML += '<language>en-gb</language>'
    rssXML += '<ttl>5</ttl>'

    Object.values(data).forEach(article => {
      rssXML += '<item>'
      rssXML += `<title>${article.title}</title>`
      rssXML += `<link>${article.url}</link>`
      rssXML += `<description>${article.desc}</description>`
      rssXML += `<pubDate>${article.date}</pubDate>`
      rssXML += '</item>'
    })

    rssXML += '</channel>'
    rssXML += '</rss>'

    res.set('Content-Type', 'text/xml')
    res.send(rssXML)
  })
})

// Default 404 route
router.get('*', function (req, res) {
  let xmlError = ''
  xmlError += '<?xml version="2.0" encoding="UTF-8" ?>\n'
  xmlError += '<response>\n'
  xmlError += '\t<success>false</success>\n'
  xmlError += '\t<message>Unknown request</message>\n'
  xmlError += '</response>'

  res.status(404).set('Content-Type', 'text/xml').send(xmlError)
})

module.exports = router
