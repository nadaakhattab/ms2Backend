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
            return res.status(404).send("User not found");
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

router.post('/viewAttendance',async(req,res)=>{
    try{
    var userId=req.headers.payload.id;
    var monthToView=req.body.month;
    var yearToView=req.body.year;
    if(!yearToView||!monthToView){
        return res.status(400).send("Please enter month and year") 

    }else{
        var monthDate=new Date(yearToView,monthToView);
        var nextMonthDate;
        if(monthToView===11){
            nextMonthDate=new Date(yearToView+1,0);
        
        }else{
            nextMonthDate=new Date(yearToView,monthToView+1);
        }
        var records=await attendance.find({id: userId},
            {date:{
                $gte: monthDate,
                $lt: nextMonthDate
        }});
        return res.status(200).send(records);
    }
    }catch(error){
        return res.status(500).send(error.message);
    }
    

});

router.get('/viewAllAttendance',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var records=await attendance.find({id: userId});
        return res.status(200).send(records);
    }catch(error){
        return res.status(500).send(error.message);
    }
});

router.post('/missingDays',async(req,res)=>{
    try{
        var start=req.body.startDate;
        var end=req.body.endDate;
        if(!start||!end){
            //start or end not provided in body
            return res.status(400).send("No dates provided");
        }else{
            var userId=req.headers.payload.id;
            var user=await staffMembers.findOne({id: userId});
            if(user){
                var startDate=new Date(start);
                var endDate=new Date(end);
                if(startDate<endDate){
                    var userLeaves=user.acceptedLeaves;
                    //get records between 2 provided dates
                    var records=await attendance.find({id: userId,
                        date:{$gte:startDate,$lte:endDate}});
                    var missingDays=[];   
                    var d=startDate;
                    while(d<=endDate){
                        //loop over days from start to end 
                       var day=d.getDay();
                       if(day!==5 && day!==user.dayOffNumber){
                           //not friday and not day off
                           if(!userLeaves.constains(d)){
                               //not a leave
                            var check= records.filter(function(record){
                                return record.date==d;
                            })
                            if(check<1){
                                //if no records found then add to missing 
                                missingDays.push(d);
                            }

                           }
                       }
                        d.setDate(d.getDate()+1);
                    } 
                    res.status(200).send(missingDays);
                }else{
                    return res.status(400).send("Invalid dates");
                }
       
            }else{
                return res.status(404).send("User not found");   
            }
        }

    }catch(error){
        return res.status(500).send(error.message);
    }
});

router.post('/hours',async(req,res)=>{
    try{
        var monthToView=req.body.month;
        var yearToView=req.body.year;
        if(!monthToView||!yearToView){
            //start or end not provided in body
            return res.status(400).send("No dates provided");
        }else{
            var userId=req.headers.payload.id;
            var user=await staffMembers.findOne({id: userId});
            if(user){
                var startDate=new Date(yearToView,monthToView);
                var endDate;
                if(monthToView===11){
                    endDate=new Date(yearToView+1,0);
                
                }else{
                    endDate=new Date(yearToView,monthToView+1);
                }
                var curDate=new Date();
                var dateToday = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
                if(dateToday<endDate){
                    endDate=dateToday;
                }

                if(startDate<endDate){
                    //get records between 2 provided dates
                    var records=await attendance.find({id: userId,
                        date:{$gte:startDate,$lt:endDate}});
                    var requiredHours=0;
                    var workedHours=0;    
                    for(var i=0;i<records.length;i++){
                        var day=record.date.getDay();
                        if(day!=5 && day!=user.dayOffNumber){
                            requiredHours+=8.24
                        }
                        var signIn=records.signIn;
                        var minSignIn=signIn[0].getHours();
                        if(minSignIn<7){ 
                            //add sign at 7 before 7
                            minSignIn.setHours(7,0,0);
                            signIn.unshift(minSignIn);
                        }
                        //remove sign ins not between 7 and 7 
                        signIn=signIn.filter(function(timeRecord){
                            return timeRecord.getHours()>=7 && timeRecord.getHours()<=15;
                        }) 

                        var signOut=records.signOut;
                        var maxSignOut=signOut[signOut.length-1].getHours();
                        if(maxSignout>=15){
                            //add sign out at 7
                            maxSignout.setHours(15,0,0);
                            signOut.push(maxSignOut);
                        }
                        //remove sign ins not between 7 and 7 
                        signOut=signOut.filter(function(timeRecord){
                            return timeRecord.getHours()>=7 && timeRecord.getHours()<=15;
                        }) 

                        for(var j=0;j<signOut.length&&signIn.length>0;j++){
                            var min=signIn.get(0)
                            if(signOut[j]>min){
                                signIn=signIn.filter(function(timeRecord){
                                    return timeRecord>min;
                                })
                                workedHours+=(signOut[j].getTime()-min.getTime())/(1000*3600);
                            }
                        }
                    } 
                    var resultingHours=workedHours-requiredHours; 
                    var missing=0;
                    var extra=0;
                    if(resultingHours>0) {
                        extra=resultingHours;
                    }else{
                        missing=-1*resultingHours;
                    }
                    return res.status(200).send({
                        missingHours:missing,
                        extraHours:extra
                    }) ;

                }else{
                    return res.status(400).send("Invalid dates");
                }
       
            }else{
                return res.status(404).send("User not found");   
            }
        }

    }catch(error){
        return res.status(500).send(error.message);
    }

});

module.exports=router;