import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import Chance from 'chance'
import rClient from '../helpers/redis_db'
import mClient from '../helpers/mongo_db'
import GphApiClient from 'giphy-js-sdk-core'

const router = express.Router()
const client = GphApiClient(process.env.GIPHY_APIKEY)
const chance = new Chance()

router.get('/:format', (req, res) => {
  rClient.exists(`giphy:${req.query.query}`, (err, reply) => {
    let limit = Math.min(req.query.limit || 20, process.env.MAX_GIFS_PER_REQUEST)

    if (reply === 1) {
      // exists, fetch from redis
      fetchGifsFromRedis(req.query.query, req.params.format, limit, res)
    } else {
      //doesn't exist, fetch from Giphy
      fetchGifsFromGiphy(req.query.query, req.params.format, limit, res)
    }
    
    const newSearch = new mClient.Search({ query: req.query.query })
    newSearch.save((err, search) => {
      if (err) {
        console.log(err)
      } else {
        console.log(search.query)
      }
    })
  })
})

const fetchGifsFromRedis = (query, format, limit, res) => {
  let gifs = []

  rClient.smembers(`giphy:${query}`, (err, reply) => {

    if (err) {
      gifs = [{id: 'error', url: 'error'}]
    } else {
      // returned gifs
      let numGifs = Math.min(reply.length, limit)
      let indices = chance.unique(chance.integer, numGifs, {min: 0, max: reply.length-1})

      for (let i = 0; i < indices.length; i++) {
        gifs.push(JSON.parse(reply[indices[i]]))
      }
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify(gifs))

    } else if (format === 'html') {
      res.render('pages/gallery', {
        gifs: gifs
      })
      
    } else {
      res.send('Error: Unknown format')
    }
  })
}

const fetchGifsFromGiphy = (query, format, limit, res) => {
  let gifs = []

  client.search('gifs', {
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
      }

      // returned gifs
      let numGifs = Math.min(gifCache.length, limit)
      let indices = chance.unique(chance.integer, numGifs, {min: 0, max: gifCache.length-1})

      for (let i = 0; i < indices.length; i++) {
        gifs.push(gifCache[indices[i]])
      }
    })

    .catch(() => {
      gifs = [{id: 'error', url: 'error'}]
    })

    .finally(() => {
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(gifs))

      } else if (format === 'html') {
        res.render('pages/gallery', {
          gifs: gifs
        })
        
      } else {
        res.send('Error: Unknwon format')
      }
    })
}

module.exports = router