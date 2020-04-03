/* global $ */

// The different sort types
const sortFunctions = {
  latest: (newsArray) => {
    return newsArray.sort((a, b) => {
      return (new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1)
    })
  },

  featured: (newsArray) => {
    // TODO: Implement this
    // Not sure how this is going to be implemented
    return newsArray
  },

  happiest: (newsArray) => {
    return newsArray.sort((a, b) => {
      return (a.sentiment < b.sentiment ? 1 : -1)
    })
  }
}

// Map the types to extra string for the query
const sourceMappings = {
  news: '',
  reddit: 'Reddit'
}

// Format the given date with the time as HH:MMAM/PM DD/MM/YYYY
function formatDate (date) {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return formatAMPM(d) + ' ' + [day, month, year].join('/')
}

// Extract and format the given time from the date HH:MMAM/PM
function formatAMPM (date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours || 12
  minutes = minutes < 10 ? '0' + minutes : minutes

  const strTime = hours + ':' + minutes + ampm
  return strTime
}

// Trim and clean up the url to just return domain
function formatURL (url) {
  const matches = url.match(/^https?:\/\/(?:www\.)?([^/?#]+)(?:[/?#]|$)/i)
  return matches[1]
}

// A helper function to set a browser cookie
function setCookie (cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

// Toggle dark mode on and off using various classes
function toggleDark () {
  document.body.classList.toggle('dark')

  // Change the dark theme button colour
  const btnDark = document.querySelector('#btnDark')
  btnDark.classList.toggle('btn-dark')
  btnDark.classList.toggle('btn-light')

  // Change the dark theme button icon
  const btnDarkIcon = document.querySelector('#btnDark > i')
  btnDarkIcon.classList.toggle('fa-moon')
  btnDarkIcon.classList.toggle('fa-sun')

  // Change the article link button colours
  const btnsLink = document.querySelectorAll('a.card-link')
  btnsLink.forEach(btnLink => {
    btnLink.classList.toggle('btn-primary')
    btnLink.classList.toggle('btn-dark')
  })

  // Create or destroy the theme-color meta tag for chrome nav bar colour on mobile
  if (document.body.classList.contains('dark')) {
    const metaTag = document.createElement('meta')
    metaTag.name = 'theme-color'
    metaTag.content = '#343a40'
    document.head.appendChild(metaTag)
  } else {
    document.querySelector('meta[name="theme-color"]').remove()
  }

  // Update the browser cookie to persist dark theme accross refreshes
  setCookie('dark', document.body.classList.contains('dark'), 365)
}
document.querySelector('#btnDark').addEventListener('click', toggleDark)

// Generate the html for the given article
function generateArticle (article) {
  let newHTML = ''

  // Format the date and source
  const parsedDate = formatDate(article.date)
  const parsedSource = formatURL(article.url)

  newHTML += '<div class="card">'

  newHTML += '<div class="card-body">'

  newHTML += `<h5 class="card-title">${article.title}</h5>`
  newHTML += `<h6 class="card-subtitle mb-2 text-muted">${parsedDate + ' &bull; ' + parsedSource}</h6>`
  newHTML += `<p class="card-text">${article.desc.replace(/\n/g, '<br>')}</p>`

  // Theme the link button appropriately for dark theme
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

function sortNews () {
  const main = document.querySelector('main')
  const sort = document.querySelector('#sort-dropdown .dropdown-toggle').dataset.type

  // Clear the main page contents and build a new one
  main.innerHTML = ''

  sortFunctions[sort](Object.values(window.newsData)).forEach(article => {
    main.innerHTML += generateArticle(article)
  })
}

// Request the news from the backend and update the page
async function getNews () {
  const main = document.querySelector('main')
  const source = document.querySelector('#source-dropdown .dropdown-toggle').dataset.type

  main.innerHTML = '<p>Loading...</p>'

  // Send the request for the latest news
  const response = await window.fetch('/api/query' + sourceMappings[source])
  const json = await response.json()

  if (json.success) {
    // Store the newsData for the sorting
    window.newsData = json.news

    // Call the sorting function
    sortNews()
  } else {
    // Let the user know there was some form of error
    main.innerHTML = `<p>An error occured while getting news: ${json.message}</p>`
  }
}

// Call any functions needed on page load
async function load () {
  await getNews()
}

load()

// Update dropdowns with selected item
function UpdateDropdown (root, e) {
  // Make sure the click event is there
  if (e.clickEvent === undefined) { return false }
  const target = e.clickEvent.target

  // Check if its an option we clicked on
  if (target.classList.contains('dropdown-item')) {
    // Update the dropdown and type
    const dropdownBtn = root.querySelector('.dropdown-toggle')
    dropdownBtn.innerHTML = target.innerHTML + ' <span class="caret"></span>'
    dropdownBtn.dataset.type = target.dataset.type

    return true
  }

  return false
}

$('#sort-dropdown').on('hide.bs.dropdown', function (e) {
  if (UpdateDropdown(this, e)) {
    sortNews()
  }
})

$('#source-dropdown').on('hide.bs.dropdown', function (e) {
  if (UpdateDropdown(this, e)) {
    getNews()
  }
})
