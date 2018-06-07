import dotenv from 'dotenv'
dotenv.config()

import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

//Routes
import index from './routes/index'
import gifme from './routes/gifme'
import searchStats from './routes/searchStats'

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3001)

app.use('/', index)
app.use('/gifme', gifme)
app.use('/searchStats', searchStats)

// eslint-disable-next-line no-unused-vars
const server = app.listen(app.get('port'), () => {
  console.log(`GIFcentration Server listening on port ${app.get('port')}`)
})