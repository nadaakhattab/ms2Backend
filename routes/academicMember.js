const express=require('express');
const router=express.Router();
const academicMembers=require('../models/academicMember');
const requests=require('../models/requests');
const departments=require('../models/department');
const slots=require('../models/slot');
const courses=require('../models/course');
const staffMember = require('../models/staffMember');
const attendance = require('../models/attendance');
const academicMember = require('../models/academicMember');
const notification=require('../models/notification');
const validations = require('../validations/academicmember');
const Joi = require('joi');
const { request } = require('express');
const { date } = require('joi');



const validateBody =(req, res,next)  =>  { try{ 
    let result;
  switch(req.path){
    case '/sendReplacementRequest':result = validations.sendReplacementRequest.validate(req.body); 
    break;
     //case '/viewReplacementRequests':result = validations.EditLocation.validate(req.body); 
    //break;
     case '/sendSlotLinkingRequest':result = validations.sendSlotLinkingRequest.validate(req.body); 
    break;
    case '/sendChangeDayOffRequest':result = validations.sendChangeDayOffRequest.validate(req.body); 
    break;
    case '/sendLeaveRequest':result = validations.sendLeaveRequest.validate(req.body); 
    break;
   // case '/addCourse':result = validations.AddCourse.validate(req.body); 
   // break;
   // case '/signIn':result = validations.SignIn.validate(req.body); 
   // break;
   // case '/signOut':result = validations.SignOut.validate(req.body); 
   // break;
  
  }
  
    const { value, error } = result; 
    const valid = error == null; 
    if (!valid) { 
      res.status(422).send( 'Validation error: Please make sure all required fields are given') 
    } else { 
  next();
    }  
  }
  catch(err){
    console.log(err);
    res.status(405).send("Validation error: Please make sure all required fields are given");
  }}





router.post('/sendReplacementRequest',async(validateBody,(req,res)=>{
    try{
        var replacementId=req.body.id;
        var courseId=req.body.course;
        var reqSlot=req.body.slot;
        var reqDay=req.body.day;
        var reqLocation=req.body.location;
        var sendingId=req.headers.payload.id;
        var reqDate=req.body.date;

        if(!replacementId||!courseId||!reqLocation||!reqSlot||!reqDay||!reqDate){
            return res.status(400).send("Please provide id of replacement");
        }else{
            var sending=await academicMembers.findOne({id:sendingId,course:courseId});
            if(sending){
                var departmentReq=sending.department;
                var valid=await academicMembers.findOne({id:replacementId,department:departmentReq,course:courseId});
                console.log(sending);
                if(valid){
                    var request=await requests.create({
                        fromId: sendingId,
                        toId:replacementId,
                        type: "replacement",
                        slot:reqSlot,
                        location:reqLocation,
                        course:courseId,
                        day:reqDay,
                        date:reqDate
                    });
                    return res.status(200).send(request);
                }else{
                    return res.status(403).send("Please choose replacement in same department and course");
                }

            }else{
                return res.status(403).send("Academic member not found");

            }


        }

    }catch(error){
        return res.status(500).send(error.message);
    }

}));

router.get('/viewReplacementRequests',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var request=await requests.find({toId:userId});
        if(request.length>0){
            return res.status(200).send(request);
        }else{
            return res.status(200).send("No requests present");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }


});

router.post('/sendSlotLinkingRequest',async(validateBody,(req,res)=>{
    try{
        var sendingId=req.headers.payload.id;
        var courseId=req.body.course;
        var slotId=req.body.slot;
        console.log(slotId);
        if(!courseId||!slotId){
            return res.status(400).send("Please provide course name and replacement id");
        }else{
            var course=await courses.findOne({name: courseId});
            var todayDate=new Date();
            todayDate.setHours(0,0,0);
            if(course){
                var reqSlotValid=await slots.findOne({course:courseId,id:slotId});
                if(reqSlotValid){
                    if(!reqSlotValid.instructor){
                        var sendTo=course.coordinator;
                        var request=await requests.create({
                            fromId: sendingId,
                            toId:sendTo,
                            type: "slotLinking",
                            slotId:slotId,
                            course:courseId,
                            date:todayDate
                        });
                        return res.status(200).send(request);
    
                    }else{
                        return res.status(404).send("Slot already assigned");
                    }
                    
                }else{
                    return res.status(404).send("Slot not found");
                }
            }else{
                return res.status(404).send("Course not found");
            }

        }

    }catch(error){
        return res.status(500).send(error.message);
    }

}));

router.post('/sendChangeDayOffRequest',async(validateBody,(req,res)=>{
    try{
        var sendingId=req.headers.payload.id;
        var reqReason=req.body.reason;
        var dayToChange=req.body.day;

        if(dayToChange){
            var sending=await academicMembers.findOne({id:sendingId});
            if(sending){
                var departmentReq=sending.department;
                var hod=await departments.findOne({name:departmentReq});
                var todayDate=new Date();
                todayDate.setHours(0,0,0);
                if(hod){
                    var request=await requests.create({
                        fromId: sendingId,
                        toId:hod.HOD,
                        type: "changeDayOff",
                        reason: reqReason,
                        date:todayDate,
                        dayToChange:day
                    });
                    return res.status(200).send(request);
        
                }else{
                    return res.status(404).send("HOD not found");   
                }
    
            }else{
                return res.status(404).send("Department not found");
    
            }

        }else{
            return res.status(400).send("Please provide day off");

        }


    }catch(error){
        return res.status(500).send(error.message);
    }

}));

router.get('/viewRequests',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var request=await requests.find({fromId:userId});
        if(request.length>0){
            return res.status(200).send(request);
        }else{
            return res.status(200).send("No submitted requests present");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }


});

router.get('/viewRequests/:status',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var reqStatus=req.params.status;
        if(reqStatus==undefined){
            
                return  res.status(300).send("Undefined Request Status");
        }
        if(reqStatus=="Accepted"||reqStatus=="Pending"||reqStatus=="Rejected"){
            var request=await requests.find({fromId:userId,status:reqStatus});
            if(request.length>0){
                return res.status(200).send(request);
            }else{
                return res.status(200).send("No requests present with that status");
            }
        }else{
            return res.status(404).send("Invalid status");
        }

    }catch(error){
        return res.status(500).send(error.message);
    }


});

//add code
router.post('/sendLeaveRequest',async(validateBody,(req,res)=>{

try{
    if(req.headers.payload.type=="HR"){
         res.status(301).send("HR submit leave requests");
    }
      var sendingId=req.headers.payload.id;
        var reqReason=req.body.reason;
        var leaveType=req.body.leave;
        var sending=await academicMembers.findOne({id:sendingId});
        var departmentReq=sending.department;
        var todayDate=new Date();
        todayDate.setHours(0,0,0);
        var dept=await departments.find({_id:departmentReq});
        const hod= dept.HOD;
        if(hod){
            switch(leaveType){
            case 'Annual':
                if(date>leaveStartDate){
                     res.status(301).send("Can't submit request: Deadline passed"); 
                }
                else{
                    request.findOne({ fromId: sendingId,type:"Replacement", status:"Accepted",leaveStartDate,leaveEndDate}).then ((acceptedRequest=>{
                        academicMember.findOne({id:acceptedRequest.instructor}).then (replacement=>{
                            //look if there is a replacement for his slots in this day & instructor teaches same course that is accepted if true {
                            if(replacement){
                                //there is a replacement person 
                            academicMember.findOne({id:sendingId}).then((currUser)=>{
                                if(currUser.course==replacement.course){
                               requests.create({
                                                fromId: sendingId,
                                                toId:replacementId,
                                                type: "Annual",
                                                reason: reqReason,
                                                date:todayDate,
                                                replacement:replacement.id
                                        
                                            }).then((reques)=>{
                                               return res.status(200).send(reques); 
                                            })
                                            
                                }
                                else{
                                    res.status(301).send("Error:Replacement Staff doesnt teach the same Course");
                                }
                            })
                        }
                        //No replacement
                         //send the request with request.replacement= instructor that accepted his request
// }else { send without a replacement so HOD WILL DECIDE}
                        requests.create({
                                                fromId: sendingId,
                                                toId:replacementId,
                                                type: "Annual",
                                                reason: reqReason,
                                                date:todayDate,
                                        
                                            }).then(reques=>{
                         res.status(200).json({
                                                message:"Your request has been submitted. It is up to the HOD to accept/decline. since you had no replacement instructors during your leave",
                                                data:request});
                                            });
                                           
                        });     
                    }));

                }
                break;

            case'Accidental':
                staffMember.findOne({id:req.headers.payload.id}).then ((member)=>{
                   let duration= req.body.leaveEndDate.getTime()-req.body.leaveStartDate.getTime();
                   duration= duration/(1000*3600*24);
                if(member.annualLeaves-duration>0.9 && duration<=6){
                const newLeaves= member.annualLeaves-duration;
                    staffMember.findOneAndUpdate({id:req.headers.payload.id},{$set:{annualLeaves:newLeaves}}).then(updatedmem=>{
                        requests.create({
                    fromId: sendingId,
                    toId:replacementId,
                    type: "Accidental",
                    reason: reqReason,
                    date:todayDate,
                    leaveStartDate:req.body.leaveStartDate,
                    leaveEndDate:req.body.leaveEndDate,
                    //status = accepted?? since already etkhasamo men his leaves?
                }).then(request=>{
                   return res.status(200).send(request);  
                });
                        });    
                    }
                    else {
                        res.status(301).send("Can't Make leave request as number of leaves exceeded permited");
                    }});
                    break;
            case"Sick":
            let dif= date.getTime()-leaveStartDate.getTime();
            dif= dif/(1000*3600*24);
            if(dif<=3){
            if(req.body.documents==undefined){
                res.status(301).send("Error Must Submit Documents for proof");
            }else {
            requests.create({
                    fromId: sendingId,
                    toId:replacementId,
                    type: "Sick",
                    reason: reqReason,
                    date:todayDate,
                    leaveStartDate:req.body.leaveStartDate,
                    leaveEndDate:req.body.leaveEndDate,
                    documents:req.body.documents
                }).then(request=>{
                   return res.status(200).send(request);  
                });
}
            }
            else{
                res.status(301).send("Can't submit request: Deadline passed");
            }
            break;


            case"Maternity":
 staffMember.findOne({id:req.headers.payload.id}).then ((member)=>{
     if(member.gender=="female"){
 if(req.body.documents==undefined){
                res.status(301).send("Error Must Submit Documents for proof");
            }else {
            requests.create({
                    fromId: sendingId,
                    toId:replacementId,
                    type: "Maternity",
                    reason: reqReason,
                    date:todayDate,
                    leaveStartDate:req.body.leaveStartDate,
                    leaveEndDate:req.body.leaveEndDate,
                    documents:req.body.documents
                }).then(request=>{
                   return res.status(200).send(request);  
                });
                }}
                else{
                    res.status(301).send("ERROR: Maternity leaves are for Females only");
                }
            });
            break;

            case"Compensation":
           
            //get month &year from leavestartdate && get day from his dayoff
              if(reqReason==undefined){
                return res.status(400).send("Please provide reason for compensation leave");
                 } 

                  //find a day in this month 
            attendance.findMany({id:fromId}).then(result=>{
                if(result){
//filter el result bel day w el month

   var startDate=new Date(leaveStartDate.getYear(),leaveStartDate.getMonth(),11);
                var endDate;
                if(leaveStartDate.getMonth()==11){
                    endDate=new Date(leaveStartDate.getYear()+1,0,10);
                
                 }else{
                    endDate=new Date(leaveStartDate.getYear(),leaveStartDate.getMonth()+1,10);
                }

                   var records=result.filter(function(record){
                            var newdate=new Date(Date.parse(record.date));
                            return newdate>=startDate && newdate<endDate
                        })

                for(let i=0;i<records.length;i++){
                       let day=new Date(Date.parse(records[i].date)).getDay();
                        if(day==user.dayOffNumber){
                          
                     requests.create({
                    fromId: sendingId,
                    toId:replacementId,
                    type: "Compensation",
                    reason: reqReason,
                    date:todayDate,
                    leaveStartDate:req.body.leaveStartDate,
                    leaveEndDate:req.body.leaveEndDate,
               
                }).then(request=>{
                   return res.status(200).send(request);  
                });

                        }
                }
             
                }else{
                    res.status(301).send("You didn't attend any extra day form your day off for compensation");

                }
            })
            break;
            }
        }else{
            return res.status(404).send("HOD not found");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }



}));

router.delete('/cancelRequest/:id',async(req,res)=>{
    try{
    var reqId=req.params.id;
    if(reqId==undefined){
       
            return  res.status(300).send("Undefined ID");
           
    }
    var request=await requests.findOne({_id:reqId});
    if(request){
        var todayDate=new Date();
        todayDate.setHours(0,0,0);
        if(request.status=="Pending"||request.date>todayDate){
            if(request.type=="leave"){
                if(request.leaveType=="Annual"||request.leaveType=="Accidental"){
                    var days=Math.ceil(((request.startDate).getTime()-(request.endDate).getTime())/(1000*3600*24));
                    var from=request.fromId;
                    var staff=await staffMember.findOne({id:from});
                    var leaves=staff.annualLeaves;
                    leaves=leaves+days;
                    var staffUpdate=await staffMember.findOneAndUpdate({id:from},{annualLeaves:leaves});
                }
            }
            var requestDeleted=await requests.findOneAndDelete({_id:reqId});
            return res.status(200).send(requestDeleted);
        }else{
            return res.status(400).send("can not delete request as it is not pending/date has passed");
        }
    }else{
        return res.status(404).send("Request not found");

    }

    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/schedule',async(req,res)=>{
    try{
        
        var userId=req.headers.payload.id;
        console.log(userId);
        var todayDate=new Date();
        todayDate.setHours(0,0,0);
        var scheduleSlots= await slots.find({instructor:userId});
        var scheduleReplacements=await requests.find({toId:userId,status:"Accepted",date:{$gte:todayDate},type:"replacement"});
        var schedule={};
        if(scheduleSlots && scheduleReplacements ){
            if(!(scheduleSlots.length>0)||!(scheduleReplacements.length>0)){
                return res.status(200).send("No teaching activities or replacements");
            }else{
                    schedule.slots=scheduleSlots;
                    schedule.replacements=scheduleReplacements;
                    return res.status(200).send(schedule);
            }
        }else{
            return res.status(200).send("No teaching activities");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/notifications/:id',async(req,res)=>{
    try{
        var userId=req.params.id;
        if(userId==undefined){
            return  res.status(300).send("Undefined ID");
           }
        var notify=await notification.find({to:userId});
        if(notify){
            if(notify.length>0){
                return res.status(200).send(notify);
        
            }else{
                return res.status(200).send("No notifications to show");
        
            }
    
        }else{
            return res.status(404).send("Error")
    
        }

    }catch(error){
        return res.status(500).send(error.message);

    }


})

module.exports = router;