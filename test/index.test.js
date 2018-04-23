require('dotenv').config()
let chai = require('chai')
let expect = chai.expect
let request = require('request')

describe('Main Page', () => {
  it('Main page should read "Hello World! I am your new leader!"', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}`, (error, res, body) => {
      expect(body).to.equal('Hello World! I am your new leader!')
      done()
    })
  })
})

describe('Url endpoint', () => {
  it('should get a JSON object', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/urls`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('object')
      done()
    })
  })

  it('the JSON object should have the key "urls", which has an array as a value', (done) => {
    request('http://localhost:3000/urls', (error, res, body) => {

      let json = JSON.parse(body)
      expect(json.urls).to.be.an('array')
      done()
    })
  })
})