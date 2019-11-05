import dammy from '../dammy/users.js';
import sess from '../dammy/sessions';
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
        } else if(!bod.lastName) {
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
            const data = {
                Id:dammy.length+1,
                firstName:bod.firstName,
                lastName:bod.lastName,
                email:bod.email,
                password: bod.password,
                occupation:bod.occupation,
                address:bod.address,
                bio:bod.bio,
                role: bod.role
            }
    
            dammy.forEach((val) => {
                if (val.email === req.body.email) {
                    return res.status(409).json({
                        success : 'false',
                        Message : 'Already exist'
                    })
                } 
            });
            const existEmail = bod.email;
                
            /*dammy.map((user) => {
                if (user.email === existEmail) { 
                    return res.status(409).json({
                        success : 'false',
                        Message : 'Already exist'
                    })
                }
            })*/
        
            dammy.push(data);
    
    
            //defining token
            const token = jwt.sign({ email: data.email, password: data.password }, process.env.KEY, {
            // expires in 24 hours
            expiresIn: 86400, 
            })
            
            //returning values if success
            return res.status(201).json({
                status:  201,
                message: data.firstName + ' created successfully', 
                token,
                data : {
                    Id:data.Id,
                    firstName:data.firstName,
                    lastName:data.lastName,
                    email:data.email,
                    occupation:data.occupation,
                    bio:data.bio
                }
            })
        //end of signUp
        }
    }

    //Login a user
   static login( req, res) {

    //email and password as mandatory
    if (!req.body.email) {
      res.status(400).json({
        status: '400',
        message: 'Email is mandatory',
      });
    } else if (!req.body.password) {
      res.status(400).json({
        status: '400',
        message: 'password is mandatory',
      });
    } else {
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
    //   freem.admin(req, res);
      const id = parseInt(req.params.userId, 10);
      let dataFound;
      let itemIndex;
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
  
      }else  if (dataFound.role!=="mentee"){
        return res.status(409).json({
          success: 'false',
          message: 'You cannot change its role',
  
        });
      }
  
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
    };

    //get all mentors
    static  getAllMentors(req, res) {
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
    try {
      res.status(200).json({
        status: 200,
        data: dammy
      });
    }catch (error) {
       console.log(error);
    }
   }

   //create a mentorship request session
   static  createMentoshipReq( req, res) {
     freem.mentee(req, res);
     const bod = req.body;
    //  freem.mentee(req,res)
 
     //forbidding important fields to be empty
     if(!bod.mentorId) {
       return res.status(404).json({
         success: 'false',
         message: 'mentorId is mandatory'
       })
     } else if(!bod.questions) {
       return res.status(404).json({
         success: 'false',
         message: 'questions mandatory'
 
       })
     }
       
       const mentorFound = dammy.find(Mentor=> Mentor.mentorId === bod.mentorId);
       if (!mentorFound) {
         return res.status(404).json({
           success: 'false',
           message: 'Mentor not found',
         });
       }
       const mentee = dammy.find(mente=>mente.email===req.decodedToken.email);
       if(!mentee){
         return res.status(500).json({
           success: 'false',
           message : 'Undefined error'
         })
       }

       //Defining new session
       const data = {
         Id:sess.length+1,
         mentorId: mentorFound.mentorId,
         menteeId:mentee.id,
         questions:bod.questions,
         menteeEmail:mentee.email,
         status: "pending",
       }
 
       sess.push(data); 
        
       return res.status(200).json({
         status:  200,
         message: 'session created successfully', 
         data : {
           sessionId:data.Id,
           menteeId:data.menteeId,
           mentorId: data.mentorId,
           menteeEmail:data.menteeEmail,
           questions:data.questions,
           status: data.status,
         }
       });
     };

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
       status: "accept"
     };
 
     sess.splice(sessionIndex, 1, data);

     return res.status(201).json({
       status: 201,
       message: 'mentorship session request accepted',
       data
     });

     }
     
     static rejectMentorship(req,res){
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
    }

     // checking mentor
   static mentor(req, res) {
    dammy.map((mentor)=>{
      if (req.decodedToken.email === mentor.email) {
        if(mentor.role !== 'mentor'){
          res.status(401).json({
            message: 'Access not allowed, mentor Only',
            email:'you are a ' + mentor.role +' and your email is '+ req.decodedToken.email,
          });
        }
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
        }
      })
    }


     
}

export default freem;