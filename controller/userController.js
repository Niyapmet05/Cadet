import dammy from '../dammy/users.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

class freem {
    static signUp(req, res) {
        const bod = req.body;
    
        //forbidding important fields to be empty
        if(!bod.firstName) {
            return res.status(404).json({
                success: 'false',
                message: 'FirstName cannot be empty'
            });
        } else if(!bod.lastName) {
            return res.status(404).json({
                success: 'false',
                message: 'Last name cannot be empty'
            });

        }else if(!bod.email) {
            return res.status(404).json({
                success: 'false',
                message: 'Email cannot be empty'
            });

        }else if(!bod.password) {
            return res.status(404).json({
                success: 'false',
                message: 'Password cannot be empty'
            });

        }else if(!bod.address) {
            return res.status(404).json({
                success: 'false',
                message: 'Address cannot be empty'
            });

        }else if(!bod.bio) {
            return res.status(404).json({
                success: 'false',
                message: 'Bio cannot be empty'
            });

        }else if(!bod.occupation) {
            return res.status(404).json({
                success: 'false',
                message: 'Occupation cannot be empty'
            });
    
        }else if(!bod.expertise) {
            return res.status(404).json({
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
        

}

export default freem;