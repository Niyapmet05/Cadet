import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import tokena from '../middleware/token';

// Configure chai
chai.use(chaiHttp);
chai.should();
let token = '';

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
      "password": "12345",
      "token": "fddssqddf"
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


//Changer a user to a mentor
describe('Testing changeToMentor function', () => {
  //user role is mentee
  it('Status should be 201 for user is a mentee', (done) => {
    
    chai.request(app)
    
    .patch(`/user/3`)
    .set("token", "tokena")
    .end((err, res) => {
      res.should.have.status(201);

      done();
    });
  });
  //user role is not a mentee
  it('Status should be 409 for user is not a mentee', (done) => {
    
    chai.request(app)
    
    .patch(`/user/2`)
    .set("token", "tokena")
    .end((err, res) => {
      res.should.have.status(409);

      done();
    });
  });
  
  //user role is not found
  it('Status should be 404 for user is not found', (done) => {
    
    chai.request(app)
    
    .patch(`/user/4`)
    .set("token", "tokena")
    .end((err, res) => {
      res.should.have.status(404);

      done();
    });
  });

})


//Get all mentor
describe('Testing getAllMentors function', () => {
  it('Status should be 200 for displaying mentors', (done) => {
    
    chai.request(app)
    
    .get(`/mentors`)
    .set("token", "tokena")
    .end((err, res) => {
      res.should.have.status(200);

      done();
    });
  });
})

//Get all users
describe('Testing getAllUsers function', () => {
  it('Status should be 200 for displaying users', (done) => {
    
    chai.request(app)
    
    .get(`/users`)
    .set("token", token)
    .end((err, res) => {
      res.should.have.status(200);

      done();
    });
  });
})

//creating mentorship session
describe('Testing acceptMentorship function',()=>{
  it('status should be 404 for non existing session', (done)=>{
    chai.request(app)
    .patch('/sessions/4/accept')
    // .set('token',token)
    .end((err,res)=>{
      res.should.have.status(404)

      done();
    })
  })

  it('status should be 404 for a session with responded status', (done)=>{
    chai.request(app)
    .patch('/sessions/3/accept')
    // .set('token',token)
    .end((err,res)=>{
      res.should.have.status(404)

      done();
    })
  })

  it('status should be 201 for existing session', (done)=>{
    chai.request(app)
    .patch('/sessions/1/accept')
    // .set('token',token)
    .end((err,res)=>{
      res.should.have.status(201)

      done();
    })
  })
})