import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

//Routes
import index from './routes/index'
import gifme from './routes/gifme'
import redis from './routes/redis'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)

app.use('/', index)
app.use('/gifme', gifme)
app.use('/redis', redis)

// eslint-disable-next-line no-unused-vars
const server = app.listen(app.get('port'), () => {
  console.log(`GIFcentration Server listening on port ${app.get('port')}`)
})