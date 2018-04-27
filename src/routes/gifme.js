import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import GphApiClient from 'giphy-js-sdk-core'

const router = express.Router()
const client = GphApiClient(process.env.GIPHY_APIKEY)

router.get('/:format', (req, res) => {
  let gifs = []

  client.search('gifs', {
    'q': req.query.query,
    'limit': req.query.limit
  })

    .then((giphyRes) => {
      for (let i = 0; i < giphyRes.data.length; i++) {
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
      if (req.params.format === 'json') {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(gifs))

      } else if (req.params.format === 'html') {
        res.render('pages/gallery', {
          gifs: gifs
        })
        
      } else {
        res.send('WAT')
      }
    })
})

module.exports = router