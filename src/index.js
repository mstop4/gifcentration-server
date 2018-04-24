import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import GphApiClient from 'giphy-js-sdk-core'

dotenv.config()

const app = express()
app.use(morgan('short'))

const client = GphApiClient(process.env.GIPHY_APIKEY)

app.get('/', (req, res) => {
  res.send('Hello World! I am your new leader!')
})

app.get('/gifme', (req, res) => {
  let gifs = []

  client.search('gifs', {'q': req.query.query})
    .then((giphyRes) => {
      for (let i = 0; i < giphyRes.data.length; i++) {
        let url = `https://media.giphy.com/media/${giphyRes.data[i].images.media_id}/giphy.gif`
        gifs.push(url)
      }
    })
    .catch(() => {
      gifs = ['error']
    })
    .finally(() => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(gifs))
    })
})

// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`GIFcentration Server listening on port ${process.env.SERVER_PORT}`)
})