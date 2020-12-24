const express=require('express');
const router=express.Router();
const staffMembers=require('../models/staffMember');
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');
const otpGenerator = require('otp-generator');

router.post('/login',async(req,res)=>{
    try{
        const inputEmail=req.body.email;
        const inputPassword=req.body.password;

        if(!inputEmail){
            return res.status(400).send("Please enter email");
        }else{
            const user= await staffMembers.findOne({email:inputEmail});
            if(!user){
                return res.status(401).send("Invalid email")
            }else{
                if(user.firstLogin===true){
                    return res.status(300).send("First login please reset password")
                }else{
                    if(!inputPassword){
                        return res.status(400).send("Please enter password")      
                    }else{
                        const correctPassword=await bcryptjs.compare(inputPassword,user.password);
                        if(!correctPassword){
                            return res.status(400).send("Invalid username and password combination");
                        }else{
                           // console.log("userid"+user);
                            var payload={
                                email:user.email,
                                type:user.type,
                                id:user.id
                            }     
                                const accessToken=jwt.sign(payload,global.accessKey,
                                    // {expiresIn: "100m"}
                                );
                                const refreshToken=jwt.sign(payload,global.refreshKey);
                                global.refreshTokens.push(refreshToken);
                                console.log(global.refreshTokens)
                                return res.status(200).send({
                                    access: accessToken,
                                    refresh: refreshToken
                                });
                        }
                }  
                }            
            }          
        }        
    }
    catch(error)
    {
        return res.status(500).send(error.message);
    }
});

router.post('/refreshToken',(req,res)=>{
    try{
        const refreshToken=req.headers.authorization;
        //console.log(refreshToken);
        if(!refreshToken){
           // console.log('no token');
            return res.status(401).send("No refresh token");
        }
        if(!global.refreshTokens.includes(refreshToken)){
           // console.log('not in refresh tokens')
            return res.status(403).send("Invalid refresh token");
        }
        const payload=jwt.verify(refreshToken,global.refreshKey);
        const accessToken=jwt.sign(payload,global.accessKey,
            // {expiresIn: "10m"}
            );
        return res.status(200).send({
            access: accessToken
        });

    }catch(error){
        return res.status(500).send(error.message);
    }

})

router.post('/resetPassword',async(req,res)=>{
    try{
        const inputEmail=req.body.email;
        if(!inputEmail){
            return res.status(400).send("Please enter email");
        }else{
            const user= await staffMembers.findOne({email:inputEmail});
            if(!user){
                return res.status(401).send("Invalid user")
            }else{
                const salt=await bcryptjs.genSalt(10);
                var generatedPassword=otpGenerator.generate(6);
                var hashedPassword=await bcryptjs.hash(generatedPassword,salt);           
                var updatedUser=await staffMembers.findOneAndUpdate({email:inputEmail},{password: hashedPassword},{new:true});
                return res.status(200).send(generatedPassword);
            }
        }
    }catch(error){
        return res.status(500).send(error.message);
    }
});

module.exports= router