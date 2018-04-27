import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import rClient from '../helpers/redis_db'
import GphApiClient from 'giphy-js-sdk-core'

const router = express.Router()
const client = GphApiClient(process.env.GIPHY_APIKEY)

router.get('/:format', (req, res) => {
  rClient.exists(req.query.query, (err, reply) => {
    if (reply === 1) {
      // exists, fetch from redis
      console.log('key exists')
    } else {
      //doesn't exist, fetch from Giphy
      console.log('key does not exist')
      let limit = Math.min(req.query.limit || 20, process.env.MAX_GIFS_PER_REQUEST)
      fetchGifsFromGiphy(req.query.query, req.params.format, limit, res)
    }
  })
})

const fetchGifsFromGiphy = (query, format, limit, res) => {
  let gifs = []
  console.log(limit)

  client.search('gifs', {
    'q': query,
    'limit': process.env.MAX_GIFS_PER_REQUEST
  })

    .then((giphyRes) => {
      let numGifs = Math.min(giphyRes.data.length, limit)

      for (let i = 0; i < numGifs; i++) {
        let url = null
        
        // return GIFs with less than 200px height and width
        if (parseInt(giphyRes.data[i].images.fixed_width.height) > 200) {
          url = `https://media.giphy.com/media/${giphyRes.data[i].images.media_id}/200.gif`
        } else {
          url = `https://media.giphy.com/media/${giphyRes.data[i].images.media_id}/200w.gif`
        }
        gifs.push(url)
      }
    })

    .catch(() => {
      gifs = ['error']
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
        res.send('WAT')
      }
    })
}

module.exports = router