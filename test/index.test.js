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

describe('/gifme endpoint', () => {

  it('should get search results for "cats" as an array', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme?query=cats`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.not.empty.and.not.includes('error')
      done()
    })
  })

  it('a blank query should return an empty array', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme?query=`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.empty
      done()
    })
  })

  it('a missing query should still return some results', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.not.empty.and.not.includes('error')
      done()
    })
  })
})