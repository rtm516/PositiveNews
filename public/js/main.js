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

function formatURL (url) {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // return hostname (will be null if no match is found)
  return matches[1];
}

function setCookie (cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function toggleDark () {
  document.body.classList.toggle('dark')

  const btnDark = document.querySelector('#btnDark')
  btnDark.classList.toggle('btn-dark')
  btnDark.classList.toggle('btn-light')

  const btnDarkIcon = document.querySelector('#btnDark > i')
  btnDarkIcon.classList.toggle('fa-moon')
  btnDarkIcon.classList.toggle('fa-sun')

  const btnsLink = document.querySelectorAll('a.card-link')
  btnsLink.forEach(btnLink => {
    btnLink.classList.toggle('btn-primary')
    btnLink.classList.toggle('btn-dark')
  })

  setCookie('dark', document.body.classList.contains('dark'), 365)
}
document.querySelector('#btnDark').addEventListener('click', toggleDark)

function generateArticle (article) {
  let newHTML = ''

  article.date = formatDate(article.date)
  article.source = formatURL(article.url);

  newHTML += '<div class="card">'

  newHTML += '<div class="card-body">'

  newHTML += `<h5 class="card-title">${article.title}</h5>`
  newHTML += `<h6 class="card-subtitle mb-2 text-muted">${article.date + ' • ' + article.source}</h6>`
  newHTML += `<p class="card-text">${article.desc}</p>`

  let btnClass = 'btn-primary'
  if (document.body.classList.contains('dark')) {
    btnClass = 'btn-dark'
  }

  newHTML += `<a href="${article.url}" class="card-link btn ${btnClass}">Visit</a>`

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
