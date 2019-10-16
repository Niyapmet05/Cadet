import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

// Configure chai
chai.use(chaiHttp);
chai.should();

//sign up
describe('Testing sign up function', () => {
  //Registered user (email)
  it('Status should be 409 for existing user', (done) => {
    
    chai.request(app)
    
    .post(`/auth/signup`)
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

  //New user (new email)
  it('Status should be 200 for non existing user', (done) => {
    
    chai.request(app)
    
    .post(`/auth/signup`)
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

  //empty field
  it('Status should be 400 for empty field', (done) => {
    
    chai.request(app)
    
    .post(`/auth/signup`)
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
      res.should.have.status(400);

      done();
    });
  });

});


//Login
describe('Testing sign in function', () => {
  //Correct email and password
  it('Status should be 200 for matching email and password', (done) => {
    
    chai.request(app)
    
    .post(`/auth/signin`)
    .send( {
      "email": "niyomurengeziaphrodis@gmail.com",
      "password": "12345"
    })
    .end((err, res) => {
      res.should.have.status(200);

      done();
    });
  });

   //inCorrect email and password
   it('Status should be 404 for mismatching email and password', (done) => {
    
    chai.request(app)
    
    .post(`/auth/signin`)
    .send( {
      "email": "niyomurengeziaphrodis@gmail.com",
      "password": "1234"
    })
    .end((err, res) => {
      res.should.have.status(404);

      done();
    });
  });

  //empty field
  it('Status should be 400 for empty field', (done) => {
    
    chai.request(app)
    
    .post(`/auth/signin`)
    .send( {
      "email": "",
      "password": "",
    })
    .end((err, res) => {
      res.should.have.status(400);

      done();
    });
  });

})