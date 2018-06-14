import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mClient from '../helpers/mongo_db'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(400).send('Try /searchStats/popular instead')
})

router.get('/popular', (req, res) => {
  mClient.Search.aggregate([
    { $group: {
      _id: '$query',
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } },
    { $limit: parseInt(req.query.limit) },
    // { $limit: req.query.limit }
  ], (err, searches) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      res.status(500).send(JSON.stringify([]))
    } else {
      res.status(200).send(JSON.stringify(searches))
    }
  })
})

router.get('/recent', (req, res) => {
  mClient.Search.find({})
    .limit(parseInt(req.query.limit))
    .sort({ date: -1 })
    .exec((err, searches) => {
      res.setHeader('Content-Type', 'application/json')
      if (err) {
        res.status(500).send(JSON.stringify([]))
      } else {
        res.status(200).send(JSON.stringify(searches))
      }
    })
})

module.exports = router