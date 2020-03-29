function generateArticle (article) {
  let newHTML = ''

  newHTML += '<div class="card">'

  newHTML += '<div class="card-body">'

  newHTML += `<h5 class="card-title">${article.title}</h5>`
  newHTML += `<p class="card-text">${article.desc}</p>`
  newHTML += `<a href="${article.url}" class="card-link">Visit</a>`

  newHTML += '</div>'

  newHTML += '</div>'

  newHTML += '<br>'

  return newHTML
}

async function getNews () {
  const main = document.querySelector('#main')

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
