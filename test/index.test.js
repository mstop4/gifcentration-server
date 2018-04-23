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

describe('/json endpoint', () => {
  it('should get a JSON object', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/json`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('object')
      done()
    })
  })

  it('the JSON object should have the key "urls", which has an array as a value', (done) => {
    request('http://localhost:3000/json', (error, res, body) => {

      let json = JSON.parse(body)
      expect(json.urls).to.be.an('array')
      done()
    })
  })
})

describe('/gifme endpoint', () => {
  it('should get search results for "cats" as an array', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme?query=cats`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array')
      done()
    })
  })
})