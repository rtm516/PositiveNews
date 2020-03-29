function formatDate (date) {
  var d = new Date(date)
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return formatAMPM(d) + ' ' + [day, month, year].join('/')
}

function formatAMPM (date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours || 12
  minutes = minutes < 10 ? '0' + minutes : minutes

  var strTime = hours + ':' + minutes + ampm
  return strTime
}

function generateArticle (article) {
  let newHTML = ''

  article.date = formatDate(article.date)

  newHTML += '<div class="card">'

  newHTML += '<div class="card-body">'

  newHTML += `<h5 class="card-title">${article.title}</h5>`
  newHTML += `<h6 class="card-subtitle mb-2 text-muted">${article.date}</h6>`
  newHTML += `<p class="card-text">${article.desc}</p>`
  newHTML += `<a href="${article.url}" class="card-link">Visit</a>`

  newHTML += '</div>'

  newHTML += '</div>'

  newHTML += '<br>'

  return newHTML
}

async function getNews () {
  const main = document.querySelector('main')

  const response = await window.fetch('/api/query')
  const json = await response.json()

  if (json.success) {
    main.innerHTML = ''
    Object.values(json.news).forEach(article => {
      main.innerHTML += generateArticle(article)
    })
  } else {
    main.innerHTML = `<p>An error occured while getting news: ${json.message}</p>`
  }
}

async function load () {
  await getNews()
}

load()
