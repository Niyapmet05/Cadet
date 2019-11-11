import dammy from '../dammy/users.js';
import sess from '../dammy/sessions';
import rev from '../dammy/sessionReview';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

class freem {
  static signUp(req, res) {
    const bod = req.body;
    
    //forbidding important fields to be empty
    if(!bod.firstName) {
      return res.status(400).json({
        success: 'false',
        message: 'FirstName cannot be empty'
      });
    }else if(!bod.lastName) {
      return res.status(400).json({
        success: 'false',
        message: 'Last name cannot be empty'
      });
    }else if(!bod.email) {
      return res.status(400).json({
        success: 'false',
        message: 'Email cannot be empty'
      });
    }else if(!bod.password) {
      return res.status(400).json({
        success: 'false',
        message: 'Password cannot be empty'
      });
    }else if(!bod.address) {
      return res.status(400).json({
        success: 'false',
        message: 'Address cannot be empty'
      });
    }else if(!bod.bio) {
      return res.status(400).json({
        success: 'false',
        message: 'Bio cannot be empty'
      });
    }else if(!bod.occupation) {
      return res.status(400).json({
        success: 'false',
        message: 'Occupation cannot be empty'
      });
    }else if(!bod.expertise) {
      return res.status(400).json({
        success: 'false',
        message: 'Expertise cannot be empty'
      });
    }else{
      const existEmail = dammy.find(user => user.email ===req.body.email);
      if (existEmail) {
        return res.status(409).json({
          success : 'false',
          Message : 'Already exist'
        })
      } else{
        const data = {
          id:dammy.length+1,
          firstName:bod.firstName,
          lastName:bod.lastName,
          email:bod.email,
          password: bod.password,
          occupation:bod.occupation,
          address:bod.address,
          bio:bod.bio,
          role: bod.role
        }
        //defining token
        const token = jwt.sign({ email: data.email, password: data.password }, process.env.KEY, {
        // expires in 24 hours
        expiresIn: 86400, 
        })
        
        dammy.push(data);
        return res.status(201).json({
          status:  201,
          message: data.firstName + ' created successfully', 
          token,
          data : {
            id:data.id,
            firstName:data.firstName,
            lastName:data.lastName,
            email:data.email,
            occupation:data.occupation,
            bio:data.bio
          }
        });
      }
    }
  }

  //Login a user
  static login( req, res) {
    //email and password as mandatory
    if(!req.body.email) {
      res.status(400).json({
        status: '400',
        message: 'Email is mandatory',
      });
    }else if(!req.body.password) {
      res.status(400).json({
        status: '400',
        message: 'password is mandatory',
      });
    }else{
      //verfying if email and password match
      const matchvalues = dammy.find(Users => Users.email === req.body.email && Users.password === req.body.password);
      if (matchvalues) {
        //defining token
        const token = jwt.sign({ email: req.body.email, password: req.body.password }, process.env.KEY, {
          expiresIn: 86400, // expires in 24 hours
        });
        res.status(200).json({
          status: '200',
          message: 'User is successful login',
          data: {token},
        });
      }else{
        res.status(404).json({
          status: '404',
          message: 'Email and password does not match',
        });
      }
    }
  }
    
  //Change a user to a mentor.
  static changeToMentor( req, res){
    // if(freem.admin(req, res)){
    const id = parseInt(req.params.userId, 10);
    let dataFound;
    let itemIndex;
    const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role !=='admin'){
      res.status(403).json({
        message: 'Access not allowed, admin Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email
      })
    }else{
      dammy.map((data, index) => {
        if (data.id === id) {
          dataFound = data;
          itemIndex = index;
        }
      });
      if (!dataFound) {
        return res.status(404).json({
          success: 'false',
          message: 'user not found',
        });
      }else if (dataFound.role!== "mentee"){
        return res.status(409).json({
          success: 'false',
          message: 'You cannot change its role',
        });
      }else{
        const data = {
          id: id,
          lastName: dataFound.lastName,
          firstName: dataFound.firstName,
          email:  dataFound.email,
          address: dataFound.address,
          bio: dataFound.bio,
          occupation: dataFound.occupation,
          expertise: dataFound.expertise,
          role: "mentor"
        };

        dammy.splice(itemIndex, 1, data);
        return res.status(201).json({
          status: 201,
          message: 'User account changed to mentor',
          id : data.id,
          role : data.role
        });
      }
    }
  };

  //get all mentors
  static  getAllMentors(req, res) {
    const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role === 'mentor'){
      res.status(401).json({
        message: 'Access not allowed',
        email:'you are a ' + users.role +' and your email is '+ req.decodedToken.email

      })
    }
    const mentors=[]; let mentorId;
    dammy.forEach((user) => {
      if (user.role === "mentor") {
        user.mentorId = user.id;
        mentors.push(user);
      }
    })
    res.status(200).json({
      status: '200',
      data:mentors
    });
  }

  //get all users
  static  getAllUsers(req, res) {
    /*const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role !== 'mentee'){
      res.status(401).json({
        message: 'Access not allowed, mentee Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email
      })
    }*/
    try {
      res.status(200).json({
        status: 200,
        data: dammy
      });
    }catch (error) {
      console.log(error);
    }
  }

  static getMentor(req, res){
    const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role === 'mentor'){
      res.status(401).json({
        message: 'Access not allowed, mentee Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email

      })
    }
    const id = parseInt(req.params.mentorId, 10);
    const mentor = dammy.find(user => user.mentorId === id);
    if(!mentor){
      return res.status(404).json({
        success : 'false',
        message : 'Mentor of this Id does not exist'
      })
    }else{
      const data = {
        mentorId : mentor.mentorId,
        firstName : mentor.firstName,
        lastName : mentor.lastName,
        email : mentor.email,
        password : mentor.password,
        address : mentor.address,
        bio : mentor.bio,
        occupation : mentor.occupation,
        expertise : mentor.expertise
      }
      return res.status(200).json({
        data
      })
    }
  }

  //create a mentorship request session
  static  createMentoshipReq( req, res) {
  const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role !== 'mentee'){
      res.status(401).json({
        message: 'Access not allowed, mentee Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email

      })
    }else{
      const bod = req.body;
      //forbidding important fields to be empty
      if(!bod.mentorId) {
        return res.status(404).json({
          success: 'false',
          message: 'mentorId is mandatory'
        })
      }else if(!bod.questions) {
        return res.status(404).json({
          success: 'false',
          message: 'questions mandatory'
        })
      }else{
        const mentorFound = dammy.find(Mentor=> Mentor.mentorId === bod.mentorId);
        if (!mentorFound) {
          return res.status(404).json({
            success: 'false',
            message: 'Mentor not found',
          });
        }else{
          const session = sess.find(ses=>ses.questions === bod.questions && ses.mentorId === bod.mentorId);
          if(session){
            return res.status(409).json({
              success: 'false',
              message : 'Already exist'
            })
          }else{
            //Defining new session
            const data = {
              sessionId:sess.length+1,
              mentorId: mentorFound.mentorId,
              menteeId:users.id,
              questions:bod.questions,
              menteeEmail:users.email,
              status: "pending",
            }

            sess.push(data); 
            return res.status(200).json({
              status:  200,
              message: 'session created successfully', 
              data : {
                sessionId:data.id,
                menteeId:data.menteeId,
                mentorId: data.mentorId,
                menteeEmail:data.menteeEmail,
                questions:data.questions,
                status: data.status,
              }
            });
          };
        }
      }
    }
  }


     /*static mentorship(req,res){
      freem.mentor(req,res);
      const id = parseInt(req.params.sessionId,10);
      let sessionFound;
      let sessionIndex;

      sess.map((session,index)=>{
        if(session.sessionId===id){
          sessionFound = session;
          sessionIndex = index;
        }
      });

      if (!sessionFound) {
        return res.status(404).json({
          success: 'false',
          message: 'session not found',
        });
      }

     const mentor = dammy.find(mento=>mento.email===req.decodedToken.email);
      const mySessions = sess.find(mySess=> mySess.mentorId === mentor.mentorId);
     //  console.log(mySessions);

      if(!mySessions){
        return res.status(404).json({
          success: 'false',
          message: 'You are not the owner',
        });
      }

      if (sessionFound.status!=="pending"){
      return res.status(404).json({
        success: 'false',
        message: 'session was already responded',
      });
    }

    const data = {
      sessionId: id,
      mentorId: sessionFound.mentorId,
      menteeId: sessionFound.menteeId,
      questions: sessionFound.questions,
      menteeEmail:sessionFound.menteeEmail,
      status: ""
    };

    sess.splice(sessionIndex, 1, data);
    
    return res.status(201).json({
      status: 201,
      message: 'mentorship session request accepted',
      data
    });

    }*/
     
  static acceptMentorship(req,res){
    const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role !== 'mentor'){
      res.status(401).json({
        message: 'Access not allowed, mentor Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email
      });
    }else{
      const id = parseInt(req.params.sessionId,10);
      let sessionFound;
      let sessionIndex;

      sess.map((session,index)=>{
        if(session.sessionId===id){
          sessionFound = session;
          sessionIndex = index;
        }
      });
      
      if (!sessionFound) {
        return res.status(404).json({
          success: 'false',
          message: 'session not found',
        });
      }else{
        // const mentor = dammy.find(mento=>mento.email===req.decodedToken.email);
        // const mySessions = sess.find(mySess=> mySess.mentorId === users.mentorId);
        if(sessionFound.mentorId !== users.mentorId){
          return res.status(401).json({
            success: 'false',
            message: 'You are not the owner',
          });
        }else if (sessionFound.status!=="pending"){
          return res.status(404).json({
            success: 'false',
            message: 'session was already responded',
          });
        }else{
          const data = {
            sessionId: id,
            mentorId: sessionFound.mentorId,
            menteeId: sessionFound.menteeId,
            questions: sessionFound.questions,
            menteeEmail:sessionFound.menteeEmail,
            status: "accepted"
          };
          
          sess.splice(sessionIndex, 1, data);
          return res.status(201).json({
            status: 201,
            message: 'mentorship session request accepted',
            data
          });
        }
      }
    }
  }
  
     
  static rejectMentorship(req,res){
    const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role !== 'mentor'){
      res.status(401).json({
        message: 'Access not allowed, mentor Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email
      });
    }else{
      const id = parseInt(req.params.sessionId,10);
      let sessionFound;
      let sessionIndex;

      sess.map((session,index)=>{
        if(session.sessionId===id){
          sessionFound = session;
          sessionIndex = index;
        }
      });
      
      if (!sessionFound) {
        return res.status(404).json({
          success: 'false',
          message: 'session not found',
        });
      }else{
        // const mentor = dammy.find(mento=>mento.email===req.decodedToken.email);
        // const mySessions = sess.find(mySess=> mySess.mentorId === mentor.mentorId);
        // if(!mySessions){
        if(sessionFound.mentorId !== users.mentorId){
          return res.status(409).json({
            success: 'false',
            message: 'You are not the owner',
          });
        }else if (sessionFound.status!=="pending"){
          return res.status(404).json({
            success: 'false',
            message: 'session was already responded',
          });
        }else{
          const data = {
            sessionId: id,
            mentorId: sessionFound.mentorId,
            menteeId: sessionFound.menteeId,
            questions: sessionFound.questions,
            menteeEmail:sessionFound.menteeEmail,
            status: "rejected"
          };
          
          sess.splice(sessionIndex, 1, data);
          return res.status(201).json({
            status: 201,
            message: 'mentorship session request rejected',
            data
          });
        }
      }
    }
  }
     
   /*  static rejectMentorship(req,res){
      //  if(freem.mentor(req,res)){
      const users = dammy.find(user => user.email === req.decodedToken.email);
      if(users.role !== 'mentee'){
        res.status(401).json({
          message: 'Access not allowed, mentee Only',
          email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email

        })
      }
        const id = parseInt(req.params.sessionId,10);
        let sessionFound;
        let sessionIndex;

        sess.map((session,index)=>{
          if(session.sessionId===id){
            sessionFound = session;
            sessionIndex = index;
          }
        });

        if (!sessionFound) {
          return res.status(404).json({
            success: 'false',
            message: 'session not found',
          });
        }

        const mentor = dammy.find(mento=>mento.email===req.decodedToken.email);
        const mySessions = sess.find(mySess=> mySess.mentorId === mentor.mentorId);
        //  console.log(mySessions);

        if(!mySessions){
          return res.status(404).json({
            success: 'false',
            message: 'You are not the owner',
          });
        }

        if (sessionFound.status!=="pending"){
        return res.status(404).json({
          success: 'false',
          message: 'session was already responded',
        });
      }

      const data = {
        sessionId: id,
        mentorId: sessionFound.mentorId,
        menteeId: sessionFound.menteeId,
        questions: sessionFound.questions,
        menteeEmail:sessionFound.menteeEmail,
        status: "reject"
      };
  
      sess.splice(sessionIndex, 1, data);
  
      return res.status(201).json({
        status: 201,
        message: 'mentorship session request rejected',
        data
      });

 }*/

  //get all sessions
  static  getAllSessions(req, res) {
    const sessions = [];
    const users = dammy.find(user=>user.email === req.decodedToken.email);
    if(users.role === 'mentor'){
      sess.forEach((session) => {
        if (session.mentorId === users.mentorId) {
        sessions.push(session);
        }
      })
      
      res.status(200).json({
        status: '200',
        data:sessions
      });
    }else if(users.role ==='mentee'){
      sess.forEach((session) => {
        if (session.menteeId === users.id) {
        sessions.push(session);
        }
      })
      
      res.status(200).json({
        status: '200',
        data:sessions
      });
    }else{
      try {
        res.status(200).json({
          status: 200,
          data: sess
        });
      }catch (error) {
        console.log(error);
      }
    }
  }
  
  static sessionReview(req, res){
    const id = parseInt(req.params.sessionId,10);
    const session = sess.find(ses=>ses.sessionId===id);
    const score = req.body.score;
    const remark = req.body.remark;
    const users = dammy.find(user=>user.email===req.decodedToken.email);
    if(users.role !=='mentee'){
      res.status(403).json({
        message: 'Access not allowed, mentee Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email
      })
    }else if(!score) {
      return res.status(400).json({
        success: 'false',
        message: 'score cannot be empty'
      });
    }else if(!remark) {
      return res.status(400).json({
        success: 'false',
        message: 'remark cannot be empty'
      });
    }else if(!Number.isInteger(score) || score < 0 || score > 5 ) {

      return res.status(400).json({
        success: 'false',
        message: 'only integer between 0 and 5 are allowed'
      });
    }else if(!session){
      return res.status(404).json({
        success : false,
        message : 'session not found'
      })
    }else{
      const existedSessionReview = rev.find(sesRev=>sesRev.sessionId === session.sessionId);
      if(!existedSessionReview){
        const data = {
          sesRevId: rev.length+1,
          sessionId: session.sessionId,
          mentorId: session.mentorId,
          menteeId: session.menteeId,
          score : score,
          menteeFullName : users.lastName + ' ' + users.firstName,
          remark :remark
        }
        if(session.menteeId===users.id){
          
          rev.push(data);
          return res.status(200).json({
            success : true, 
            message: 'session reviewed',
            data
          })
        }else{
          return res.status(401).json({
            success : false, 
            userId: users.id,
            menteeId: session.menteeId,
            message: 'you are not the owner'
          })
        }

      }else{
        return res.status(409).json({
          success : false, 
          message: 'This session has already reviewed'
        })

      }
    }
  }

  //get all sessions reviews
  static  getAllSessionsReview(req, res) {
    const sessionsReview = [];
    const users = dammy.find(user=>user.email === req.decodedToken.email);
    if(users.role === 'mentor'){
      rev.forEach((sessionReview) => {
        if (sessionReview.mentorId === users.mentorId) {
          sessionsReview.push(sessionReview);
        }
      })
      
      res.status(200).json({
        status: '200',
        data:sessionsReview
      });
    }else if(users.role === 'mentee'){
      rev.forEach((sessionReview) => {
        if (sessionReview.menteeId === users.id) {
          sessionsReview.push(sessionReview);
        }
      })
      
      res.status(200).json({
        status: '200',
        data:sessionsReview
      });
    }else{
      try {
        res.status(200).json({
          status: 200,
          data: rev
        });
      }catch (error) {
        console.log(error);
      }
    }
  }

  static deleteSessionsReview(req, res){
    const users = dammy.find(user => user.email === req.decodedToken.email);
    if(users.role !== 'admin'){
      res.status(401).json({
        message: 'Access not allowed, admin Only',
        email:'you are an ' + users.role +' and your email is '+ req.decodedToken.email
      })
    }else{
      const id = parseInt(req.params.sessionsReview,10);
      const sessionReview = rev.find(reviewToDelete =>reviewToDelete.sessionId===id);
      if(!sessionReview){
        return res.status(404).json({
          success : 'false',
          message : 'No session review found'
        })
      }else{
        rev.splice(sessionReview, 1);
        return res.status(200).json({
          status : 200,
          message : 'Session review succesfully deleted'
        })
      }
    }
  }

    /* // checking mentor
   static mentor(req, res) {
    dammy.map((mentor)=>{
      if (req.decodedToken.email === mentor.email) {
        if(mentor.role !== 'mentor'){
          res.status(401).json({
            message: 'Access not allowed, mentor Only',
            email:'you are a ' + mentor.role +' and your email is '+ req.decodedToken.email,
          });
        }
        return true;
      }
    })
  }

  // checking admin
  static admin(req, res) {
    dammy.map((admin)=>{
      if (req.decodedToken.email === admin.email) {
        if(admin.role !== 'admin'){
          res.status(401).json({
            message: 'Access not allowed, Admin Only',
            email:'you are an ' + admin.role +' and your email is '+ req.decodedToken.email,
          });
        }
        return true;
      }
    })
  }


   // checking mentee
    static mentee(req, res) {
      dammy.map((mentee)=>{
        if (req.decodedToken.email === mentee.email) {
          if(mentee.role !== 'mentee'){
            res.status(401).json({
              message: 'Access not allowed, mentee Only',
              email:'you are a ' + mentee.role +' and your email is '+ req.decodedToken.email,
            });
          }
          return true;
        }
      })
    }*/


     
}

export default freem;