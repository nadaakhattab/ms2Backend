const express=require('express');
const router=express.Router();
const staffMembers=require('../models/staffMember');
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');
const otpGenerator = require('otp-generator');
 
router.post('/logout', (req, res) => {
    try{
        const refreshToken=req.body.token;
        global.refreshTokens = global.refreshTokens.filter(t => t !== refreshToken);
        return res.status(200).send("Logout successful");

    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/viewProfile',async (req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var user=await staffMembers.findOne({id: userId})
        if(!user){
            return res.status(400).send("Invalid user");
        }else{
            return res.status(200).send(user);
        }
    }catch(error){
        return res.status(500).send(error.message);
    }
});

router.get('/updateProfile',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var inputMobile=req.body.mobileNumber;
        var inputOfficeLocation=req.body.officeLocation;
        var inputEmail=req.body.email;
        var fieldsToUpdate={};
        if(!inputMobile && !inputOfficeLocation && !inputEmail){
            return res.status(400).send("No data to update");
        }else{
            if(inputMobile){
                fieldsToUpdate.mobileNumber=inputMobile;
            }
            if(inputOfficeLocation){
                fieldsToUpdate.officeLocation=inputOfficeLocation;
            }
            if(inputEmail){
                fieldsToUpdate.email=inputEmail;
            }
            fieldsToUpdate.new=true;
            var user=await staffMembers.findOneAndUpdate({id:userId}, fieldsToUpdate);
            return res.status(200).send(user);
        }
    }catch(error){
        return res.status(500).send(error.message);       
    }
});

router.post('/changePassword',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var inputPassword=req.body.password;
        if(!inputPassword){
            return res.status(400).send("No password to update");
        }else{
            const salt=await bcryptjs.genSalt(10);
            var hashedPassword=await bcryptjs.hash(inputPassword,salt);           
            var user=await staffMembers.findOneAndUpdate({id:userId},{password: hashedPassword, new:true});
            res.status(200).send(user);
        }
    }catch(error){
        return res.status(500).send(error.message);
    }
});

module.exports=router;