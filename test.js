var request = require('supertest');
var app = require('./app');
var expect = require('chai').expect; 

describe('Login API', function() {
    it('Should success if credential is valid', function(done) {
        request(app)
           .post('/login')
           .set('Accept', 'application/json')
           .set('Content-Type', 'application/json')
           .send({ logemail: 'richard@richard.de', logpassword: 'richard' })
           .expect(200)
           .expect('Content-Type', /json/)
           .expect(function(response) {
              expect(response.body).not.to.be.empty;
           })
           .end(done);
    }); 
});