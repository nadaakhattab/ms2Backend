const express=require('express');
const router=express.Router();
const staffMembers=require('../models/staffMember');
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');

router.post('/login',async(req,res)=>{
    try{
        const inputEmail=req.body.email;
        const inputPassword=req.body.password;

        if(!inputEmail||!inputPassword){
            return res.status(400).json({msg:"Please enter email and password"});

        }else{
            const user= await staffMembers.findOne({email:inputEmail});
            if(!user){
                return res.status(400).json({msg:"Invalid user"})
            }else{
                const correctPassword=await bcryptjs.compare(inputPassword,user.password);
                if(!correctPassword){
                    return res.status(400).json({msg:"Invalid username and password combination"});
                }else{
                    console.log("userid"+user);
                    var payload={
                        email:user.email,
                        type:user.type,
                        id:user.id
                    }

                        const accessToken=jwt.sign(payload,global.accessKey,{expiresIn: "10m"});
                        const refreshToken=jwt.sign(payload,global.refreshKey);
                        global.refreshTokens.push(refreshToken);
                        console.log(global.refreshTokens)
                        res.send({
                            access: accessToken,
                            refresh: refreshToken
                        });
                }              
            }           
        }        
    }
    catch(error)
    {
        res.status(500).json({error:error.message});
    }
});

router.post('/refreshToken',(req,res)=>{
    const refreshToken=req.headers.authorization;
    //console.log(refreshToken);
    if(!refreshToken){
        console.log('no token');
        return res.sendStatus(401)
    }
    if(!global.refreshTokens.includes(refreshToken)){
        console.log('not in refresh tokens')
        return res.sendStatus(403);
    }
    try{
        jwt.verify(refreshToken,global.refreshKey);
        const accessToken=jwt.sign(req.body.payload,global.accessKey,{expiresIn: "10m"});
        return res.send({
            access: accessToken
        });
    }catch(e){
        console.log(e);

    }
})

module.exports= router