import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

dotenv.config()
const app = express()
app.use(morgan('short'))

app.get('/', (req, res) => {
  res.send('Hello World! I am your new leader!')
})

app.get('/urls', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({ urls: [0] }))
})

// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.SERVER_PORT, () => {
  console.log('GIFcentration Server listening on port 3000')
} )