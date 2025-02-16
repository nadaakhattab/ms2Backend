const express=require('express');
const router=express.Router();
const staffMembers=require('../models/staffMember');
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const attendance = require('../models/attendance');
const requests=require('../models/requests');
const validations = require('../validations/staffmember');
const Joi = require('joi');
const e = require('express');


const validateBody =(req, res,next)  =>  { try{ 
    let result;
switch(req.path){
    case '/updateProfile':result = validations.UpdateProfile.validate(req.body); 
    break;
    case '/updatePassword':result = validations.ChangePassword.validate(req.body); 
    break; 
 
    

  }
  const { value, error } = result; 
  const valid = error == null; 
  if (!valid) { 
      console.log(error);
    res.status(422).send( 'Validation error: Please make sure all required fields are given') 
  } else { 
next();
  }  
}
catch(err){
  console.log(err);
  res.status(405).send("Validation error: Please make sure all required fields are given");
}}


router.post('/logout', (req, res) => {
    try{
        const refreshToken=req.body.token;
        if(refreshToken){
            global.refreshTokens = global.refreshTokens.filter(t => t !== refreshToken);
            return res.status(200).send("Logout successful");
        }else{
            return res.status(400).send("Please include refresh token");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/viewProfile',async (req,res)=>{
    try{
        var userId=req.headers.payload.id;
        if(userId== undefined){
          return  res.status(300).send("Undefined user");
        }
        else{
        var user=await staffMembers.findOne({id: userId})
        if(!user){
            return res.status(404).send("User not found");
        }else{
            return res.status(200).send(user);
        }}
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.post('/updateProfile',validateBody,async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var inputMobile=req.body.mobileNumber;
        // var inputOfficeLocation=req.body.officeLocation;
        var inputEmail=req.body.email;
        var fieldsToUpdate={};
        if(!inputMobile  && !inputEmail){
            return res.status(400).send("No data to update");
        }else{
            if(inputMobile){
                fieldsToUpdate.mobileNumber=inputMobile;
            }
            // if(inputOfficeLocation){
            //     fieldsToUpdate.officeLocation=inputOfficeLocation;
            // }
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

router.post('/updatePassword',validateBody,async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var inputPassword=req.body.password;
        var oldPass= req.body.oldPassword;
        if(!inputPassword|| !oldPass){
            return res.status(400).send("No password to update");
        }else{    
              const user= await staffMembers.findOne({email:req.body.email});
             const correctPassword=await bcryptjs.compare(oldPass,user.password);
             if(correctPassword){
                   const salt=await bcryptjs.genSalt(10);
            var hashedPassword=await bcryptjs.hash(inputPassword,salt);           
           const userup=await staffMembers.findOneAndUpdate({id:userId},{password: hashedPassword},{new:true});
            res.status(200).send("Password changed successfully"); 
             }
             else {
                 res.status(300).send("ERROR: Incorrect Old Pasword");
             }
         
        }
    }catch(error){
        return res.status(500).send(error.message);
    }
});

router.post('/signIn',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var curDate=new Date(Date.now());
        var dateToday=curDate.toLocaleDateString();
        const record=await attendance.findOne({id: userId,date:dateToday});
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
        var curDate=new Date(Date.now());
        var dateToday=curDate.toLocaleDateString();
        const record=await attendance.findOne({id: userId,date:dateToday});
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

router.get('/viewAttendance/:yearToView/:monthToView',async(req,res)=>{
    
    try{
    var userId=req.headers.payload.id;
    if(userId==undefined){
        return  res.status(300).send("Undefined user");
    }
    else{
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
        if(monthToView<=11){
            var monthDate=new Date(yearToView,monthToView,11);
            var nextMonthDate;
            if(monthToView==11){
                nextMonthDate=new Date(yearToView+1,0,10);   
            }else{
                nextMonthDate=new Date(yearToView,monthToView+1,10);
            }
            var curDate=new Date();
            var dateToday = new Date(curDate.setHours(0,0,0));
            if(dateToday<nextMonthDate){
                nextMonthDate=dateToday;
            }
            var records=await attendance.find({id: userId});
            var recordsToSend=records.filter(function(record){
                var date=new Date(Date.parse(record.date));
                return date>=monthDate && date<nextMonthDate
            });
            let filteredRecords=recordsToSend.filter(function(inputRecord){
                if(inputRecord.signOut){
                    if(inputRecord.signOut.length>0){
                        if(inputRecord.signIn){
                            if(inputRecord.signIn.length>0){
                                if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                                    return inputRecord;
                                }
    
                            }
                        }
                    }
                }
    
            });
            return res.status(200).send(filteredRecords);

        }else{
            return res.status(400).send("Please enter month between 1 and 12") 

        }

    }
    }catch(error){
        return res.status(500).send(error.message);
    }
    

});

router.get('/viewAllAttendance',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        if(userId==undefined){
            return  res.status(300).send("Undefined user");
        }
        else{
        let records=await attendance.find({id: userId});
        let filteredRecords=records.filter(function(inputRecord){
            if(inputRecord.signOut){
                if(inputRecord.signOut.length>0){
                    if(inputRecord.signIn){
                        if(inputRecord.signIn.length>0){
                            if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                                return inputRecord;
                            }

                        }
                    }
                }
            }

        });
        return res.status(200).send(filteredRecords);
    }}catch(error){
        return res.status(500).send(error.message);
    }
});

router.get('/missingDays/:yearToView/:monthToView',async(req,res)=>{
    try{
        var monthToView=parseInt(req.params.monthToView-1);
        var yearToView=parseInt(req.params.yearToView);
        // if(!monthToView||!yearToView){
        //     //start or end not provided in body
        //     return res.status(400).send("No dates provided");
        // }else{
            if(monthToView<=11){
                var userId=req.headers.payload.id;
                if(userId==undefined){
                    return  res.status(300).send("Undefined user");
                }
                else{
                var user=await staffMembers.findOne({id: userId});
                if(user){
                    var startDate=new Date(yearToView,monthToView,11);
                    var endDate;
                    if(monthToView==11){
                        endDate=new Date(yearToView+1,0,10);
                    
                    }else{
                        endDate=new Date(yearToView,monthToView+1,10);
                    }
                    var curDate=new Date();
                    var dateToday = new Date(curDate.setHours(0,0,0));
                    if(dateToday<endDate){
                        endDate=dateToday;
                    }
                    if(startDate<endDate){
                        //get records between 2 provided dates
                        var allRecords=await attendance.find({id: userId});                       
                        var records=allRecords.filter(function(record){
                            var date=new Date(Date.parse(record.date));
                            return date>=startDate && date<endDate
                        });                     
                        records=records.filter(function(inputRecord){
                            if(inputRecord.signOut){
                                if(inputRecord.signOut.length>0){
                                    if(inputRecord.signIn){
                                        if(inputRecord.signIn.length>0){
                                            if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                                                return inputRecord;
                                            }
                
                                        }
                                    }
                                }
                            }
                
                        });  
                  
                        var missingDays=[];   
                        let d=startDate;
                        while(d<=endDate){
                            //loop over days from start to end 
                           var day=d.getDay();
                           if(day!==5 && day!==user.dayOffNumber){
                            let check=[]
                            check= records.filter(function(record){
                                return d.getTime()==new Date(record.date).getTime();
                            })
                            if(check.length>0){
                                console.log("here");
                            }else{
                                var leaves= await requests.find({fromId:userId,type:"leave",
                                leaveStartDate:{$lte:d},leaveEndDate:{$gte:d},status:"Accepted"});
                                if(leaves){
                                    if(!(leaves.length>0)){
                                        missingDays.push(new Date(d));

                                    }
                                }else{
                                    missingDays.push(new Date(d));

                                }

                            }

                                        
                            
                           }
                           d=new Date (d.setDate(d.getDate()+1));
                        } 
                        console.log(missingDays.toString())
                        return res.status(200).send(missingDays);
                    }else{
                        return res.status(400).send("Invalid dates");
                    }
           
                }else{
                    return res.status(404).send("User not found");   
                }
            }

            }else{
                return res.status(400).send("Please enter month between 1 and 12") 

            }
// }

    }catch(error){
        return res.status(500).send(error.message);
    }
});

router.get('/hours/:yearToView/:monthToView',async(req,res)=>{
    try{
        var monthToView=parseInt(req.params.monthToView-1);
        var yearToView=parseInt(req.params.yearToView);
        // if(!monthToView||!yearToView){
        //     //start or end not provided in body
        //     return res.status(400).send("No dates provided");
        // }else{
            if(monthToView<=11){
                var userId=req.headers.payload.id;
                var userId=req.headers.payload.id;
                if(userId==undefined){
                    return  res.status(300).send("Undefined user");
                }
                else{
                var user=await staffMembers.findOne({id: userId});
                if(user){
                    var startDate=new Date(yearToView,monthToView,11);
                    var endDate;
                    if(monthToView==11){
                        endDate=new Date(yearToView+1,0,10);
                                    
                    }else{
                        endDate=new Date(yearToView,monthToView+1,10);
                    }
    
                    var curDate=new Date();
                    var dateToday = new Date(curDate.setHours(0,0,0));
                    if(dateToday<endDate){
                        endDate=dateToday;
                    }
                    
                    if(startDate<endDate){
                        //get records between 2 provided dates
                            var allRecords=await attendance.find({id: userId});
                            var records=allRecords.filter(function(record){
                                var date=new Date(Date.parse(record.date));
                                return date>=startDate && date<endDate
                            })
                            records=records.filter(function(inputRecord){
                                if(inputRecord.signOut){
                                    if(inputRecord.signOut.length>0){
                                        if(inputRecord.signIn){
                                            if(inputRecord.signIn.length>0){
                                                if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                                                    return inputRecord;
                                                }
                    
                                            }
                                        }
                                    }
                                }
                    
                            });
                        var requiredHours=0;
                        var workedHours=0;    
                        for(var i=0;i<records.length;i++){
                            var day=new Date(Date.parse(records[i].date)).getDay();
                            if(day!=5 && day!=user.dayOffNumber){
                                requiredHours+=8.24
                            }
                            var signIn=records[i].signIn;
                            if(signIn.length>0){
                                var minSignIn=signIn[0];
                                var minSigninHours=minSignIn.getHours();
                                console.log("Sign in hour"+minSigninHours);
                                if(minSigninHours<7){ 
                                    //add sign at 7 before 7
                                    minSignIn.setHours(7,0,0);
                                }
                                //remove sign ins not between 7 and 7 
                                signIn=signIn.filter(function(timeRecord){
                                    return timeRecord.getHours()>=7 && timeRecord.getHours()<19;
                                }) 
    
                            }
                            var signOut=records[i].signOut;
                            if(signOut.length>0){
                                var maxSignOut=signOut[signOut.length-1];
                                var maxSignOutHours=maxSignOut.getHours();
                                console.log("Sign in hour"+maxSignOutHours);
                                if(maxSignOutHours>19){
                                    //add sign out at 7
                                    maxSignOut.setHours(19,0,0);
                                    // signOut.push(maxSignOut);
                                }
                                
                                //remove sign ins not between 7 and 7 
                                signOut=signOut.filter(function(timeRecord){
                                    return timeRecord.getHours()>7 && timeRecord.getHours()<=19;
                                }) 
    
    
                            }
                            for(var j=0;j<signOut.length&&signIn.length>0;j++){
                                //console.log(signIn);
                                var min=signIn[0];
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

            }else{
                return res.status(400).send("Please enter month between 1 and 12") 

            }

// }

    }catch(error){
        return res.status(500).send(error.message);
    }

});

module.exports=router;