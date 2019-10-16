import dammy from '../dammy/users.js';
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
                bio:bod.bio
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
}

export default freem;