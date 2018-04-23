import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(3000, () => {
  console.log('GIFcentration Server listening on port 3000')
} )