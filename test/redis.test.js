require('dotenv').config()
let chai = require('chai')
let expect = chai.expect
let request = require('request')

describe('Redis DB', () => {
  it('should return "Hello World!" from redis', (done) => {
    request.post({
      url: `http://localhost:${process.env.SERVER_PORT}/redis`,
      qs: { str: 'Hello World!'}
    }, (error, res, body) => {

      request(`http://localhost:${process.env.SERVER_PORT}/redis`, (error, res, body) => {
        expect(body).to.equal('Hello World!')
        done()
      })
    })
  })
})