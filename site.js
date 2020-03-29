const express = require('express')
const logger = require('morgan')

const app = express()
const api = require('./api')

const port = process.env.PORT || 3000

app.use(logger('dev'))
app.set('view engine', 'ejs')
app.use(express.json())

app.use('/api', api)

app.use(express.static('public'))

app.get('/', (req, res) => res.render('pages/index'))

app.listen(port, () => console.log(`Positive News listening on port ${port}!`))
