import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World! I am your new leader!')
})

// eslint-disable-next-line no-unused-vars
const server = app.listen(3000, () => {
  console.log('GIFcentration Server listening on port 3000')
} )