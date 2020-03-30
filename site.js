const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
require('./override-console-log.js')

const app = express()
const api = require('./api')

const port = process.env.PORT || 3000

app.use(logger('dev'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.use('/api', api)

app.use(express.static('public'))

app.get('/', (req, res) => {
  console.log(req.cookies.dark)
  res.render('pages/index', { darkTheme: req.cookies.dark !== undefined ? req.cookies.dark === 'true' : false })
})

app.listen(port, () => console.log(`Positive News listening on port ${port}!`))
