const express=require('express');
const router=express.Router();
const staffMembers=require('../models/staffMember');
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');
const { findOneAndUpdate } = require('../models/staffMember');



router.post('/logout', (req, res) => {
    //payload 
    // console.log("ID"+req.headers.payload.email);
    const refreshToken=req.body.token;
    global.refreshTokens = global.refreshTokens.filter(t => t !== refreshToken);

    res.send("Logout successful");
});

// router.get('/viewProfile/:username',async (req,res)=>{
//     var userName=req.params.username;
//     var user=await staffMembers.findOne({username: userName})
//     if(!user){
//         return res.status(400).json({msg:"Invalid user"})
//     }else{
//         return res.send(user);
//     }
//     });


// router.get('/updateProfile',async(req,res)=>{
//     try{
//         //get id from token 
//         //authenticate
//         //check fields to update
//         var userId=1;
//         var inputUsername=req.body.username;
//         var inputMobile=req.body.mobileNumber;
//         var fieldsToUpdate={};
//         if(inputUsername!=null){
//             fieldsToUpdate.username=inputUsername;
//         }
//         if(inputMobile!=null){
//             fieldsToUpdate.mobileNumber=inputMobile;
//         }
//         var user=await findOneAndUpdate({id:userId}, fieldsToUpdate);
//     }catch(e){
//         console.log("Error in update profile"+e);
//     }
// });

// router.get('/resetPassword',async(req,res)=>{
//     try{
//     //generate random password
//     //get id from token 
//     var userId=1;
//     var generatedPassword='abc';
//     let password=findOneAndUpdate({id:userId},{password: generatedPassword});
//     //send email
//     //send success
//     }catch(e){

//     }
// });

// function authenticate(req,res,next){
//     const token=req.header('auth_token');
//     if(!token){
//         return res.status(404).json({msg:"Please login again"});
//     }
//     try{
//         const payload=jwt.verify(token,key);
//         req.header.userData=payload;
//         next();

//     }catch(error){
//         return res.status(404).json({msg:"Please login again"});
//     }
// }

// function authorize(req,res,next){
//     const user=users.findOne({id:req.body.id});
//     if(user.type==="Admin"){
//         next();
    
//     }else{
//         res.status(403).send("Invalid");
    
//     }
//     }


module.exports=router;