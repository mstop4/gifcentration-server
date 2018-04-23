import express from 'express'
import morgan from 'morgan'

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
const server = app.listen(3000, () => {
  console.log('GIFcentration Server listening on port 3000')
} )