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

app.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({ urls: [0] }))
})

app.get('/gifme', (req, res) => {
  client.search('gifs', {'q': req.query.query})
    .then((giphyRes) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(giphyRes.data))
    })
    .catch((giphyErr) => {
      let data = { error: giphyErr }
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(data))
    })
})

// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log(`GIFcentration Server listening on port ${process.env.SERVER_PORT}`)
})