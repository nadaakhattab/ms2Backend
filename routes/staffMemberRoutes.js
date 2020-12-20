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
        // var inputOfficeLocation=req.body.officeLocation;
        var inputEmail=req.body.email;
        var fieldsToUpdate={};
        if(!inputMobile && !inputOfficeLocation && !inputEmail){
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
            res.status(200).send("Password changed successfully");
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
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
    if(!yearToView||!monthToView){
        return res.status(400).send("Please enter month and year") 

    }else{
        var monthDate=new Date(yearToView,monthToView,11);
        var nextMonthDate;
        if(monthToView==11){
            nextMonthDate=new Date(yearToView+1,0,10);   
        }else{
            nextMonthDate=new Date(yearToView,monthToView+1,10);
        }
        var records=await attendance.find({id: userId});
        var recordsToSend=records.filter(function(record){
            var date=new Date(Date.parse(record.date));
            return date>=monthDate && date<nextMonthDate
        })
        return res.status(200).send(recordsToSend);
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

router.get('/missingDays/:yearToView/:monthToView',async(req,res)=>{
    try{
        var monthToView=parseInt(req.params.monthToView-1);
        var yearToView=parseInt(req.params.yearToView);
        if(!monthToView||!yearToView){
            //start or end not provided in body
            return res.status(400).send("No dates provided");
        }else{
            var userId=req.headers.payload.id;
            var user=await staffMembers.findOne({id: userId});
            if(user){
                var startDate=new Date(yearToView,monthToView,11);
                var endDate;
                if(monthToView==11){
                    endDate=new Date(yearToView+1,0,10);
                
                }else{
                    endDate=new Date(yearToView,monthToView+1,10);
                }
                if(startDate<endDate){
                    var userLeaves=[];
                    userLeaves=user.acceptedLeaves;
                    //get records between 2 provided dates
                    var allRecords=await attendance.find({id: userId});
                    var records=allRecords.filter(function(record){
                        var date=new Date(Date.parse(record.date));
                        return date>=startDate && date<endDate
                    })
                    var missingDays=[];   
                    var d=startDate;
                    while(d<=endDate){
                        //loop over days from start to end 
                       var day=d.getDay();
                       if(day!==5 && day!==user.dayOffNumber){
                           //not friday and not day off
                           if(!userLeaves.includes(d)){
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
                       d=new Date (d.setDate(d.getDate()+1));
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

router.get('/hours/:yearToView/:monthToView',async(req,res)=>{
    try{
        var monthToView=parseInt(req.params.monthToView-1);
        var yearToView=parseInt(req.params.yearToView);
        if(!monthToView||!yearToView){
            //start or end not provided in body
            return res.status(400).send("No dates provided");
        }else{
            var userId=req.headers.payload.id;
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
                    var requiredHours=0;
                    var workedHours=0;    
                    for(var i=0;i<records.length;i++){
                        var day=new Date(Date.parse(records[i].date)).getDay();
                        //console.log("Day"+day);
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
                            if(maxSignOutHours>15){
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

    }catch(error){
        return res.status(500).send(error.message);
    }

});


//in course instructor
// router.post('/assignCourseCordinator',async(req,res)=>{
//     try{
//         var taId=req.body.id;
//         var courseName=req.body.courseName;
//         if(!idToAssign||!courseName){
//             return res.status(400).send("Please provide course name and ta id");
//         }else{
//             var course=courses.find({name:courseName});
//             if(course.instructors.includes(userId)){
//                 var user=await staffMembers.findOne({id: taId});
//                 if(user){
//                     if(user.type=="TA"){
//                         var course=await courses.findOneAndUpdate({name:courseName},{coordinator: taId},{new:true});
//                         res.status(200).send(course);
//                     }else{
//                         return res.status(400).send("Course coordinator must be a TA");
//                     }
//                 }else{
//                     return res.status(401).send("Invalid id");
//                 }
//             }else{
//                 return res.status(400).send("Can only assign in your course");
//             }
//         }
//     }catch(error){
//         return res.status(500).send(error.message);
//     }


// });

// router.post('/assignSlot',async(req,res)=>{
//     try{
//         var userId=req.headers.payload.id;
//         var idToAssign=req.body.id;
//         var courseName=req.body.courseName;
//         var dayToAssign=req.body.day;
//         var slotToAssign=req.body.slot;
//         var locationToAssign=req.body.slot;
//         if(!idToAssign||!courseName){
//             return res.status(400).send("Please provide course name and ta id");
//         }else{
//             var course=courses.find({name:courseName});
//             if(course.instructors.includes(userId)){
//                 var user=await staffMembers.findOne({id: idToAssign});
//                 if(user.type=="HOD"||user.type=="TA"||user.type=="CI"||user.type=="CC"){
//                     var slot=await slots.findOne({location:locationToAssign,slot:slotToAssign,day:dayToAssign});
//                     if(slot){
//                         if(slot.course==courseName){
//                             if(slot.instructor){
//                                 var slot=await slots.findOneAndUpdate({location:locationToAssign,slot:slotToAssign,day:dayToAssign},
//                                     {instructor: idToAssign},{new:true});
    
//                             }else{
//                                 return res.status(400).send("Slot assigned to another TA");
//                             }
    
//                         }else{
//                             return res.status(400).send("Slot assigned to another course");
    
//                         }
    
//                     }else{
//                         return res.status(401).send("Invalid slot");
    
//                     }
//                 }else{
//                     return res.status(400).send("Id to assign must be an academic member");
//                 }

//             }else{
//                 return res.status(400).send("Can only assign in your course");
//             }
//         }
//     }catch(error){
//         return res.status(500).send(error.message);
//     }


// });

module.exports=router;