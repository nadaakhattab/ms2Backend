const express=require('express');
const router=express.Router();
const staffMembers=require('../models/staffMember');
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const attendance = require('../models/attendance');
 
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

router.post('/updateProfile',async(req,res)=>{
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
            var user=await staffMembers.findOneAndUpdate({id:userId}, fieldsToUpdate,{new:true});
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
            var user=await staffMembers.findOneAndUpdate({id:userId},{password: hashedPassword},{new:true});
            res.status(200).send(user);
        }
    }catch(error){
        return res.status(500).send(error.message);
    }
});

router.post('/signIn',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        const record=await attendance.findOne({id: userId});
        var curDate=new Date();
        var dateToday = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
        if(record){
            var signInArray=record.signIn;
            signInArray.push(curDate);
            var attendanceRecord=await attendance.findOneAndUpdate({id:userId,date:dateToday},{
                signIn: signInArray,
            },{new:true})
            return res.status(200).send(attendanceRecord);
        }else{
            var attendanceRecord=await attendance.create({
                id: userId,
                date: dateToday,
                signIn: [curDate],
                signOut: []
            });
            return res.status(200).send(attendanceRecord);
            
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.post('/signOut',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        const record=await attendance.findOne({id: userId});
        var curDate=new Date();
        var dateToday = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
        if(record){
            var signOutArray=record.signOut;
            signOutArray.push(curDate);
            var attendanceRecord=await attendance.findOneAndUpdate({id:userId,date:dateToday},{
                signOut: signOutArray,
            },{new:true})
            return res.status(200).send(attendanceRecord);
        }else{
            var attendanceRecord=await attendance.create({
                id: userId,
                date: dateToday,
                signIn: [],
                signOut: [curDate],
            });
            return res.status(200).send(attendanceRecord);
            
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});
module.exports=router;