const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')

const app = express()
const api = require('./api')

// Get the environment port or use the default 3000 (for nice glitch.me support)
const port = process.env.PORT || 3000

// Setup all the middleware
app.use(logger('dev'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

// Include the api route
app.use('/api', api)

// Setup the public folder for static files
app.use(express.static('public'))

// The main index page
app.get('/', (req, res) => {
  res.render('pages/index', { darkTheme: req.cookies.dark !== undefined ? req.cookies.dark === 'true' : false })
})

// Start the app listening
app.listen(port, () => console.log(`Positive News listening on port ${port}!`))
