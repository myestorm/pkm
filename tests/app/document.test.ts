import supertest from 'supertest'
import { expect, assert } from 'chai'
import app from '../../app/app'

const request = supertest(app.listen())

const prefix = '/api/document'

describe('document api test', () => {

  it(`${prefix}/list：`, (done) => {
      request
        .get(`${prefix}/list`)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('object')
          assert.equal(res.body.code, 0, 'Expected 0.');
          expect(res.body.data).to.be.an('array')
          done()
        })
  })

})
