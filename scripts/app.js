const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs/promises')
const njk = require('nunjucks')
const { randomUUID } = require('crypto')


const server = express()

njk.configure(
  'views', 
  {
    express: server        
  }    
)


server.use(bodyParser.urlencoded({ extended: true }))
server.use('/content', express.static('content'))


server.get('/', (req, res) => {
  fs.readdir('./views/posts')
    .then(
        posts => res.render("index.njk", { posts: posts.reverse() })
    )
})

server.get('/blogs', (req, res) => res.render('blogs.njk'))
server.get('/about', (req, res) => res.render('about.njk'))

server.post('/post', (req, res) => {
    const postText = req.body['post-text'].replace(/\n/, "<br>")
    const postTitle = req.body['title']
    const now = new Date(Date.now())
    const nowText = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`
    const filePath = "./views/posts/"  + now.toLocaleString().replace(/[ ,/:]/g, '-') + "-" + randomUUID() +  ".txt"

    fs.writeFile(filePath, `<h2>${postTitle}</h2><p>${postText}</p><p class="date">${nowText}</p>`)
    .then(() => res.redirect('/'))
})

const port = 12345
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})