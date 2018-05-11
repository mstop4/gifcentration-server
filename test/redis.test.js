require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const request = require('request')
const port = process.env.PORT || 3001

describe('Redis DB', () => {
  it('should return "Hello World!" from redis', (done) => {
    request.post({
      url: `http://localhost:${port}/redis`,
      qs: { str: 'Hello World!'}
    }, (error, res, body) => {

      request(`http://localhost:${port}/redis`, (error, res, body) => {
        expect(body).to.equal('Hello World!')
        done()
      })
    })
  })
})