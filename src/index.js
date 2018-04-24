import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import GphApiClient from 'giphy-js-sdk-core'

dotenv.config()

const app = express()
app.use(morgan('short'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const client = GphApiClient(process.env.GIPHY_APIKEY)

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/gifme/:format', (req, res) => {
  let gifs = []

  client.search('gifs', {'q': req.query.query})
    .then((giphyRes) => {
      for (let i = 0; i < giphyRes.data.length; i++) {
        let url = null
        
        if (parseInt(giphyRes.data[i].images.fixed_width.height) > 200) {
          url = `https://media.giphy.com/media/${giphyRes.data[i].images.media_id}/200.gif`
        } else {
          url = `https://media.giphy.com/media/${giphyRes.data[i].images.media_id}/200w.gif`
        }
        gifs.push(url)
      }
    })
    .catch(() => {
      gifs = ['error']
    })
    .finally(() => {
      if (req.params.format === 'json') {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(gifs))
      } else if (req.params.format === 'html') {
        res.render('pages/gallery', {
          gifs: gifs
        })
      } else {
        res.send('WAT')
      }
    })
})

// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`GIFcentration Server listening on port ${process.env.SERVER_PORT}`)
})