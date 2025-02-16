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
const request=require('../models/requests');
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
    case '/replyRequest':result = validations.ReplyRequest.validate(req.body); 
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

router.post('/sendReplacementRequest',validateBody,async(req,res)=>{
    try{
        var replacementId=req.body.id;
        var courseId=req.body.course;
        // var reqSlot=req.body.slot;
        // var reqDay=req.body.day;
        // var reqLocation=req.body.location;
        var reqSlotId=req.body.slot;
        var sendingId=req.headers.payload.id;
        var reqDate=req.body.date;
        var myId=req.headers.payload.id;

        if(!replacementId||!courseId||!reqDate||!reqSlotId){
            return res.status(400).send("Please provide id of replacement");
        }else{
            var myType=await staffMember.findOne({id:myId});
            var replacementType=await staffMember.findOne({id:replacementId});
           console.log(myType.type);
           console.log(replacementType.type);
            if(myType&&replacementType ){
                if(myType.type=="HOD"||replacementType.type=="HOD"){
                    
// return res.status(400).send("HOD can't send or receive replacement requests")

                }else{
                    if(myType.type==replacementType.type || myType.type=="CC"&& replacementType.type=="TA"||myType.type=="TA"&&replacementType.type=="CC" || replacementType.type=="HR"){
                   var sending=await academicMembers.findOne({id:sendingId,course:courseId});
                   console.log(sending);
                   if(sending){
                       var departmentReq=sending.department;
                       var valid=await academicMembers.findOne({id:replacementId,department:departmentReq,course:courseId});
                       console.log(sending);
                       var todayDate=new Date();
                        todayDate.setHours(0,0,0);
                       if(valid){
                           var slotValid=await slots.findOne({course:courseId,instructor:sendingId,id:reqSlotId})
                           var request=await requests.create({
                               fromId: sendingId,
                               toId:replacementId,
                               type: "replacement",
                            //    slot:reqSlot,
                            //    location:reqLocation,
                                course:courseId,
                           //    day:reqDay,
                               replacementDate:reqDate,
                               date:todayDate,
                               slotId:reqSlotId
                           });
                           return res.status(200).send(request);
                       }else{
                           return res.status(403).send("Please choose replacement in same department and course");
                       }
       
                   }else{
                       return res.status(403).send("Academic member not found");
       
                   }

               }else{
                   return res.status(402).send("CI can only send to CI and TA AND CC can only send to each other")

               }
                }



            }else{
                return res.status(402).send("Replacement id or logged in id not found")
            }



        }

    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/viewReplacementRequests',async(req,res)=>{
    try{
        console.log("here");
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

router.post('/sendSlotLinkingRequest',validateBody,async(req,res)=>{
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

});

router.post('/sendChangeDayOffRequest',validateBody,async(req,res)=>{
    try{
        var sendingId=req.headers.payload.id;
        var reqReason=req.body.reason;
        var dayToChange=req.body.day;
console.log(dayToChange=="Monday");
        if(dayToChange){
            if(dayToChange=="Sunday"||dayToChange=="Monday"||
            dayToChange=="Tuesday"||dayToChange=="Wednesday"||
            dayToChange=="Thursday"||dayToChange=="Saturday"
                ){
                    var sending=await academicMembers.findOne({id:sendingId});
                    if(sending){
                        var slotsAvailable=await slots.find({day:dayToChange,instructor:sendingId});
                        if(slotsAvailable){
                            if(slotsAvailable.length>0){
                                return res.status(400).send("Cannot request  day off if you have slots on that day");
        
                            }else{
                                let dayNumber=6;                      
                                switch(dayToChange){
                                    case"Sunday": dayNumber=0;break;
                                    case"Monday": dayNumber=1;break;
                                    case"Tuesday": dayNumber=2;break;
                                    case"Wednesday": dayNumber=3;break;
                                    case"Thursday": dayNumber=4;break;
                                    case"Saturday": dayNumber=6;break;
                                }
                                var departmentReq=sending.department;
                                var hod=await departments.findOne({name:departmentReq});
                                if(hod){
                                    var todayDate=new Date();
                                    todayDate.setHours(0,0,0);
                                    if(hod){
                                        var request=await requests.create({
                                            fromId: sendingId,
                                            toId:hod.HOD,
                                            type: "changeDayOff",
                                            reason: reqReason,
                                            date:todayDate,
                                            dayToChange:dayNumber
                                        });
                                        return res.status(200).send(request);
                            
                                    }else{
                                        return res.status(404).send("HOD not found");   
                                    }

                                }else{
                                    return res.status(404).send("No hod");
                                }

                            }
        
                        }else{
                            return res.status(400).send("Error finding slots");
        
                        }
        
            
                    }else{
                        return res.status(404).send("Member not assigned to specific department");
            
                    }

                }else{
                    return res.status(400).send("Please enter valid day off (not Friday)");

                }


        }else{
            return res.status(400).send("Please provide day off");

        }


    }catch(error){
        return res.status(500).send(error.message);
    }

});

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
router.post('/sendLeaveRequest',
validateBody
,async(req,res)=>{

try{
    if(req.headers.payload.type=="HR"){
         res.status(301).send("HR cannot submit leave requests");
    }
      var sendingId=req.headers.payload.id;
      console.log("myyy iddd",sendingId,req.headers.payload.type);
        var reqReason=req.body.reason;
        var leaveType=req.body.leave;
        var sending=await academicMembers.findOne({id:sendingId});
        console.log("myID",sending);
        var departmentReq=sending.department;
        

        var leaveStartDate=new Date(Date.parse(req.body.startDate));
        var leaveEndDate=new Date(Date.parse(req.body.endDate));
        console.log(new Date(leaveStartDate));
        var todayDate=new Date();
        todayDate.setHours(0,0,0);
        var dept=await departments.findOne({name:departmentReq});
        const hod= dept.HOD;
        console.log(hod);
        if(hod){
            console.log(leaveType)
            switch(leaveType){
            case 'Annual':
                if(todayDate>=leaveStartDate){
                     res.status(301).send("Can't submit request: Deadline passed"); 
                }
                else{
                    console.log("IN ELSE");
                    request.findOne({ fromId: sendingId,replacementDate:leaveStartDate,type:"replacement", status:"Accepted"}).then ((acceptedRequest=>{
                        console.log(sendingId);
                        console.log("leave",leaveStartDate);
                        if(acceptedRequest){ 
                            console.log(acceptedRequest);                         
                            requests.create({
                                                    fromId: sendingId,
                                                    toId:hod,
                                                    type:"leave",
                                                    leaveType: "Annual",
                                                    reason: reqReason,
                                                    date:todayDate,
                                                    leaveEndDate,
                                                    leaveStartDate,
                                                    replacement:acceptedRequest.toId
                                            
                                                }).then(request=>{
                             res.status(200).json({
                                                    message:"Your request has been submitted.",
                                                    data:request});
                                                });
                                               
                           

                        }else{
                            console.log("heree");
                            requests.create({
                                fromId: sendingId,
                                  toId:hod,
                                  type:"leave",
                                  leaveType: "Annual",
                                  reason: reqReason,
                                  date:todayDate,
                                  leaveEndDate,
                                  leaveStartDate
                          
                              }).then(request=>{
           res.status(200).json({
                                  message:"Your request has been submitted. It is up to the HOD to accept/decline. since you had no replacement instructors during your leave",
                                  data:request});
                              });
                            
                        }
    
                    }));

                }
                break;

            case'Accidental':
                staffMember.findOne({id:req.headers.payload.id}).then ((member)=>{
                   let duration= leaveEndDate.getTime()-leaveStartDate.getTime();
                   duration= duration/(1000*3600*24);
                   duration= Math.ceil(duration);
                if(Math.floor(member.annualLeaves)-duration>0 && duration<=6){
                const newLeaves= member.annualLeaves-duration;
                    // staffMember.findOneAndUpdate({id:req.headers.payload.id},{$set:{annualLeaves:newLeaves}}).then(updatedmem=>{
                        requests.create({
                     fromId: sendingId,
                                                toId:hod,
                                                type:"leave",
                                                leaveType: "Accidental",
                                                reason: reqReason,
                                                date:todayDate,
                                                leaveEndDate,
                                                leaveStartDate
                    //status = accepted?? since already etkhasamo men his leaves?
                }).then(request=>{
                   return res.status(200).send(request);  
                });
                        // });    
                    }
                    else {
                        res.status(301).send("Can't Make leave request as number of leaves exceeded permited");
                    }});
                    break;
            case"Sick":
            let dif= todayDate.getTime()-leaveStartDate.getTime();
            dif= dif/(1000*3600*24);
            if(dif<=3){
            if(req.body.documents==undefined){
                res.status(301).send("Error Must Submit Documents for proof");
            }else {
            requests.create({
                    fromId: sendingId,
                    toId:hod,
                    type:"leave",
                    leaveType: "Sick",
                    reason: reqReason,
                    date:todayDate,
                    leaveStartDate,
                    leaveEndDate,
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
                let duration= leaveEndDate.getTime()-leaveStartDate.getTime();
                   duration= duration/(1000*3600*24);
                   console.log("D"+duration);
                   if(duration<=90){
 staffMember.findOne({id:req.headers.payload.id}).then ((member)=>{
     if(member.gender=="female"){
 if(req.body.documents==undefined){
                res.status(301).send("Error Must Submit Documents for proof");
            }else {
            requests.create({
                    fromId: sendingId,
                    toId:hod,
                    type:"leave",
                    leaveType: "Maternity",
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
        }else{
            res.status(301).send("ERROR: Maternity leaves are for 3 months only");
        }
            break;

            case"Compensation":
           
            //get month &year from leavestartdate && get day from his dayoff
              if(reqReason==undefined){
                return res.status(400).send("Please provide reason for compensation leave");
                 } 

                  //find a day in this month 
                  console.log(sendingId);
            attendance.find({id:sendingId}).then(result=>{
                console.log("result",result);
                if(result.length>0){
                      console.log("result",result);
//filter el result bel day w el month

   var startDate=new Date(leaveStartDate.getYear(),leaveStartDate.getMonth(),11);
                var endDate;
                if(leaveStartDate.getMonth()==11){
                    endDate=new Date(leaveStartDate.getYear()+1,0,10);
                
                 }else{
                    endDate=new Date(leaveStartDate.getYear(),leaveStartDate.getMonth()+1,10);
                }
             var curDate=new Date();
                var dateToday = new Date(curDate.setHours(0,0,0));
                if(dateToday<endDate){
                    endDate=dateToday;
                }
                console.log("RECORDS",new Date(Date.parse(startDate)));
                 console.log("RECORDS",endDate);
               
                   var records=result.filter(function(record){
                       
                            var newdate=new Date(Date.parse(record.date));
                              console.log("NEW DATE",newdate);
                            return newdate>=startDate && newdate<endDate
                        });
                         console.log("RECORDS",records);
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
                    console.log("RECORDS",records);

                for(let i=0;i<records.length;i++){
                       let day=new Date(Date.parse(records[i].date)).getDay();
                        if(day==user.dayOffNumber){
                          
                     requests.create({
                    fromId: sendingId,
                    toId:hod,
                    type:"leave",
                    leaveType: "Compensation",
                    reason: reqReason,
                    date:todayDate,
                    leaveStartDate:req.body.leaveStartDate,
                    leaveEndDate:req.body.leaveEndDate,
               
                }).then(request=>{
                   return res.status(200).send(request);  
                });

                        }
                }
                if(records.length==0){
                    res.status(200).send("looking for a compensation");
                }
             
                }else{
                    res.status(301).send("You didn't attend any extra day yet form your day off for compensation, please atttend one and try again later");

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



});

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
        if(request.status=="Pending"||request.startDate>todayDate){
            if(request.type=="leave"){
                if(request.status=="Accepted"){
                    if(request.leaveType=="Annual"||request.leaveType=="Accidental"){
                        var days=Math.ceil(((request.startDate).getTime()-(request.endDate).getTime())/(1000*3600*24));
                        var from=request.fromId;
                        var staff=await staffMember.findOne({id:from});
                        var leaves=staff.annualLeaves;
                        leaves=leaves+days;
                        var staffUpdate=await staffMember.findOneAndUpdate({id:from},{annualLeaves:leaves});
                    }

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
        var scheduleReplacements=await requests.find({toId:userId,status:"Accepted",replacementDate:{$gte:todayDate},type:"replacement"});
        var schedule={};
        if(scheduleSlots && scheduleReplacements ){
            if(!(scheduleSlots.length>0)
            // &&!(scheduleReplacements.length>0)
            ){
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

let fullRes =[];
  function getNot(notification,i){
      console.log(notification);
      return new Promise((resolve, reject) => {
    requests.findOne({_id:notification.requestID}).then((reqFound)=>{
        // console.log("FARAH",reqFound);
        if(reqFound){
           var res={req:reqFound,
            not:notification
           }
           console.log(res);
fullRes.push(res)
        }
        resolve();
    }).catch(()=>{
         reject()});
     });
    }

router.get('/getNotification',async(req,res)=>{
    try{
        console.log("in not");
        fullRes =[];
        var userId=req.headers.payload.id;
        if(userId==undefined){
            return  res.status(300).send("Undefined ID");
           }
           console.log(userId);
        var notify=await notification.find({to:userId});
        
        if(notify){
            
            const arrayofPromises=[];
            if(notify.length>0){
                notify.forEach((notification)=>{
                    console.log(notification);
                    arrayofPromises.push(getNot(notification));

                });
Promise.all(arrayofPromises).then ((result)=>{
    console.log("done");
     return res.status(200).send(fullRes);
}).catch((err)=>{
    return res.status(300).send("ERROR");
})
               
        
            }else{
                return res.status(200).send("No notifications to show");
        
            }
    
        }else{
            return res.status(404).send("Error")
    
        }

    }catch(error){
        console.log(error);
        return res.status(500).send(error.message);

    }
});

router.post('/replyRequest',validateBody,async(req,res)=>{
    try{
        var requestId=req.body.id;
        var statusR=req.body.status;
        if(requestId && statusR){
            if(statusR=="Accepted"||statusR=="Rejected"){
                var requestToAccept=await request.findOne({_id:requestId,type:"replacement"});
                if(requestToAccept){
                    if(requestToAccept.status=="Pending"){
                  
                        var acceptedRequest=await request.findOneAndUpdate({_id:requestId,type:"replacement"},{status:statusR},{new:true});
                        var notify=await notification.create({
                            requestID: requestId,
                            accepted: req.body.accepted,
                            to:acceptedRequest.fromId
                        });
                        return res.status(200).send(acceptedRequest);
    
                    }else{
                        return res.status(400).send("Cannot accept request that is not pending");
    
                    }
    
    
                }else{
                    return res.status(404).send("Request not found");
                }

            }else{
                return res.status(400).send("Status should be Accepted or Rejected only");
                

            }


        }else{
            return res.status(400).send("Please provide request id");

        }


    }catch(error){
        return res.status(500).send(error.message);
    }

});   


module.exports = router;