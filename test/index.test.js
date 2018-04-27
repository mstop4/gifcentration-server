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