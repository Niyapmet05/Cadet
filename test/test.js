import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Testing sign up function', () => {
  it('Status should be 409 for existing user', (done) => {
    
    chai.request(app)
    
    .post(`/`)
    .send( {
      "firstName": "Aphrodis",
      "lastName": "NIYOMURENGEZI",
      "email": "niyomurengeziaphrodis@gmail.com",
      "password": "12345",
      "address": "Kicukiro",
      "bio": "Not shared",
      "occupation": "Developper",
      "expertise": "4 years in clinics"
    })
    .end((err, res) => {
      res.should.have.status(409);

      done();
    });
  });


  it('Status should be 200 for non existing user', (done) => {
    
    chai.request(app)
    
    .post(`/`)
    .send( {
      "firstName": "Caudine",
      "lastName": "UWIDUHAYE",
      "email": "laudetwari@gmail.com",
      "password": "25CN",
      "address": "Kigali",
      "bio": "engineer",
      "occupation": "developer",
      "expertise": "middle"
    })
    .end((err, res) => {
      res.should.have.status(201);

      done();
    });
  });

  

  it('Status should be 404 for empty field', (done) => {
    
    chai.request(app)
    
    .post(`/`)
    .send( {
      "firstName": "",
      "lastName": "",
      "email": "",
      "password": "",
      "address": "",
      "bio": "",
      "occupation": "",
      "expertise": ""
    })
    .end((err, res) => {
      res.should.have.status(404);

      done();
    });
  });



});