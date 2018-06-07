import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import mClient from '../helpers/mongo_db'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Try /searchStats/popular instead')
})

router.get('/popular', (req, res) => {
  mClient.Search.aggregate([
    { $group: {
      _id: '$query',
      count: { $sum: 1 }
    }},
    { $sort: { count: -1 } }
  ], (err, searches) => {
    res.setHeader('Content-Type', 'application/json')
    if (err) {
      res.send(JSON.stringify([]))
    } else {
      res.send(JSON.stringify(searches))
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
        res.send(JSON.stringify([]))
      } else {
        res.send(JSON.stringify(searches))
      }
    })
})

module.exports = router