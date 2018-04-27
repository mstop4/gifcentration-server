require('dotenv').config()
let chai = require('chai')
let expect = chai.expect
let request = require('request')

describe('/gifme endpoint', () => {

  it('should get search results for "cats" as an array', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme/json?query=cats&limit=5`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.not.empty.and.does.not.include('error')
      done()
    })
  })

  it('a blank query should return an empty array', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme/json?query=&limit=5`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.empty
      done()
    })
  })

  it('a missing query should still return some results', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme/json?limit=5`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.not.empty.and.does.not.include('error')
      done()
    })
  })

  it('should fetch 50 dog GIFs', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme/json?query=dog&limit=50`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.has.lengthOf(50)
      done()
    })
  })

  it('no limit provided, it should fetch the default (20) number of GIFs', (done) => {
    request(`http://localhost:${process.env.SERVER_PORT}/gifme/json?query=dog`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.has.lengthOf(20)
      done()
    })
  })
})