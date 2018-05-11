require('dotenv').config()
const chai = require('chai')
const expect = chai.expect
const request = require('request')
const port = process.env.PORT || 3001

describe('Main Page', () => {
  it('Main page should read "Hello World! I am your new leader!"', (done) => {
    request(`http://localhost:${port}`, (error, res, body) => {
      expect(body).to.equal('Hello World! I am your new leader!')
      done()
    })
  })
})