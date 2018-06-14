import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import Chance from 'chance'
import rClient from '../helpers/redis_db'
import mClient from '../helpers/mongo_db'
import GphApiClient from 'giphy-js-sdk-core'
import fetchStatus from '../helpers/fetchStatus'

const router = express.Router()
const gClient = GphApiClient(process.env.GIPHY_APIKEY)
const chance = new Chance()

router.get('/search/:format', (req, res) => {
  const theQuery = req.query.query.toLowerCase()

  rClient.exists(`giphy:${theQuery}`, (err, reply) => {
    let limit = Math.min(req.query.limit || 20, process.env.MAX_GIFS_PER_REQUEST)

    if (reply === 1) {
      // exists, fetch from redis
      fetchGifsFromRedis(theQuery, req.params.format, limit, res)
    } else {
      //doesn't exist, fetch from Giphy
      fetchGifsFromGiphy(theQuery, req.params.format, limit, res)
    }
  })
})

router.get('/trending/:format', (req, res) => {
  rClient.exists('giphy$:trending', (err, reply) => {
    let limit = Math.min(req.query.limit || 20, process.env.MAX_GIFS_PER_REQUEST)

    if (reply === 1) {
      // exists, fetch from redis
      fetchTrendingFromRedis(req.params.format, limit, res)
    } else {
      //doesn't exist, fetch from Giphy
      fetchTrendingFromGiphy(req.params.format, limit, res)
    }
  })
})

const saveSearchToDB = (query) => {
  // add search to MongoDB
  const newSearch = new mClient.Search({ query: query })
  newSearch.save((err, search) => {
    if (err) {
      console.log(`Error: ${err}`)
    } else {
      console.log(`Search added: ${search.query}`)
    }
  })
}

const sendResponse = (res, format, data, httpStatus) => {
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json')
    res.status(httpStatus).send(JSON.stringify(data))
  } 
  
  else if (format === 'html') {
    res.status(httpStatus).render('pages/gallery', {
      data: data
    })
  } 
  
  else {
    res.status(400).send('Error: Unknown format')
  }
}

const fetchGifsFromRedis = (query, format, limit, res) => {
  let gifs = []
  let data = {
    status: null,
    gifs: gifs
  }

  rClient.smembers(`giphy:${query}`, (err, reply) => {
    let httpStatus = null

    if (err) {
      data.status = fetchStatus.redisError
      httpStatus = 500
    } else {
      // returned gifs
      let numGifs = Math.min(reply.length, limit)
      let indices = chance.unique(chance.integer, numGifs, {min: 0, max: reply.length-1})

      for (let i = 0; i < indices.length; i++) {
        gifs.push(JSON.parse(reply[indices[i]]))
      }

      data.status = fetchStatus.ok
      httpStatus = 200
      saveSearchToDB(query)
    }

    sendResponse(res, format, data, httpStatus)
  })
}

const fetchGifsFromGiphy = (query, format, limit, res) => {
  let gifs = []
  let data = {
    status: null,
    gifs: gifs
  }
  let httpStatus = null

  gClient.search('gifs', {
    'q': query,
    'limit': process.env.MAX_GIFS_PER_REQUEST
  })
    .then((giphyRes) => {
      // gif cache
      let gifCache = []

      for (let i = 0; i < giphyRes.data.length; i++) {
        let id = giphyRes.data[i].id
        let url = null
        
        // return GIFs with less than 200px height and width
        if (parseInt(giphyRes.data[i].images.fixed_width.height) > 200) {
          url = giphyRes.data[i].images.fixed_height.gif_url
        } else {
          url = giphyRes.data[i].images.fixed_width.gif_url
        }
        gifCache.push({ id, url })
      }

      if (gifCache.length > 0) {

        //Serialize all objects in gifCache
        let serializedGifCache = gifCache.map( gif => {
          return JSON.stringify(gif)
        })

        rClient.sadd([`giphy:${query}`, ...serializedGifCache], (reply) => {
          console.log(`Redis: adding giphy:${query} - ${reply}`)
          rClient.expire(`giphy:${query}`, process.env.KEY_EXPIRY_TIME, (reply) => {
            console.log(`Redis: setting expiry of giphy:${query} to ${process.env.KEY_EXPIRY_TIME} - ${reply}`)
          })
        })

        saveSearchToDB(query)
      }

      // returned gifs
      let numGifs = Math.min(gifCache.length, limit)
      let indices = chance.unique(chance.integer, numGifs, {min: 0, max: gifCache.length-1})

      for (let i = 0; i < indices.length; i++) {
        gifs.push(gifCache[indices[i]])
      }

      data.status = fetchStatus.ok
      httpStatus = 200
    })

    .catch((err) => {
      if (err.code === 'ENOTFOUND') {
        data.status = fetchStatus.giphyError
        httpStatus = 404
      } else {
        data.status = fetchStatus.genericError
        httpStatus = 500
      }
    })

    .finally(() => {
      sendResponse(res, format, data, httpStatus)
    })
}

const fetchTrendingFromRedis = (format, limit, res) => {
  let gifs = []
  let data = {
    status: null,
    gifs: gifs
  }
  let httpStatus = null

  rClient.smembers('giphy$:trending', (err, reply) => {
    if (err) {
      data.status = fetchStatus.redisError
      httpStatus = 500
    } else {
      // returned gifs
      let numGifs = Math.min(reply.length, limit)
      let indices = chance.unique(chance.integer, numGifs, {min: 0, max: reply.length-1})

      for (let i = 0; i < indices.length; i++) {
        gifs.push(JSON.parse(reply[indices[i]]))
      }

      data.status = fetchStatus.ok
      httpStatus = 200
    }
    sendResponse(res, format, data, httpStatus)
  })
}

const fetchTrendingFromGiphy = (format, limit, res) => {
  let gifs = []
  let data = {
    status: null,
    gifs: gifs
  }
  let httpStatus = null

  gClient.trending('gifs', {
    'limit': process.env.MAX_GIFS_PER_REQUEST
  })

    .then((giphyRes) => {
      // gif cache
      let gifCache = []

      for (let i = 0; i < giphyRes.data.length; i++) {
        let id = giphyRes.data[i].id
        let url = null
        
        // return GIFs with less than 200px height and width
        if (parseInt(giphyRes.data[i].images.fixed_width.height) > 200) {
          url = giphyRes.data[i].images.fixed_height.gif_url
        } else {
          url = giphyRes.data[i].images.fixed_width.gif_url
        }
        gifCache.push({ id, url })
      }

      if (gifCache.length > 0) {

        //Serialize all objects in gifCache
        let serializedGifCache = gifCache.map( gif => {
          return JSON.stringify(gif)
        })

        rClient.sadd(['giphy$:trending', ...serializedGifCache], (reply) => {
          console.log(`Redis: adding giphy$:trending - ${reply}`)
          rClient.expire('giphy$:trending', process.env.KEY_EXPIRY_TIME, (reply) => {
            console.log(`Redis: setting expiry of giphy$:trending to ${process.env.KEY_EXPIRY_TIME} - ${reply}`)
          })
        })
      }

      // returned gifs
      let numGifs = Math.min(gifCache.length, limit)
      let indices = chance.unique(chance.integer, numGifs, {min: 0, max: gifCache.length-1})

      for (let i = 0; i < indices.length; i++) {
        gifs.push(gifCache[indices[i]])
      }

      data.status = fetchStatus.ok
      httpStatus = 200
    })

    .catch((err) => {
      if (err.code === 'ENOTFOUND') {
        data.status = fetchStatus.giphyError
        httpStatus = 404
      } else {
        data.status = fetchStatus.genericError
        httpStatus = 500
      }
    })

    .finally(() => {
      sendResponse(res, format, data, httpStatus)
    })
}

module.exports = router