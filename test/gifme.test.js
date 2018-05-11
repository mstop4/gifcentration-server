require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const request = require('request')
const port = process.env.PORT || 3001

describe('/gifme endpoint', () => {

  it('should get search results for "cats" as an array', (done) => {
    request(`http://localhost:${port}/gifme/json?query=cats&limit=5`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.not.empty.and.does.not.include('error')
      done()
    })
  })

  it('a blank query should return an empty array', (done) => {
    request(`http://localhost:${port}/gifme/json?query=&limit=5`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.empty
      done()
    })
  })

  it('a missing query should still return some results', (done) => {
    request(`http://localhost:${port}/gifme/json?limit=5`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.is.not.empty.and.does.not.include('error')
      done()
    })
  })

  it('should fetch 50 dog GIFs', (done) => {
    request(`http://localhost:${port}/gifme/json?query=dog&limit=50`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.has.lengthOf(50)
      done()
    })
  })

  it('no limit provided, it should fetch the default (20) number of GIFs', (done) => {
    request(`http://localhost:${port}/gifme/json?query=dog`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.has.lengthOf(20)
      done()
    })
  })

  it('limit higher than maximum, it should on fetch the maximum (100) number of GIFs', (done) => {
    request(`http://localhost:${port}/gifme/json?query=dog&limit=200`, (error, res, body) => {

      let json = JSON.parse(body)
      expect(json).to.be.an('array').that.has.lengthOf(100)
      done()
    })
  })
})