const express=require('express');
const router=express.Router();
const academicMembers=require('../models/academicMember');
const requests=require('../models/requests');
const departments=require('../models/department');
const slots=require('../models/slot');
const courses=require('../models/course');

router.post('/sendReplacementRequest',async(req,res)=>{
    try{
        var replacementId=req.body.id;
        var courseId=req.body.course;
        var reqSlot=req.body.slot;
        var reqDay=req.body.day;
        var reqLocation=req.body.location;
        var sendingId=req.headers.payload.id;
        if(!replacementId||!courseId||!reqLocation||!reqSlot||!reqDay){
            return res.status(400).send("Please provide id of replacement");
        }else{
            var sending=await academicMembers.find({id:sendingId,course:courseId});
            var departmentReq=sending.department;
            var valid=await academicMembers.find({id:replacementId,department:departmentReq,course:courseId});
            if(valid){
                var request=await requests.create({
                    fromId: sendingId,
                    toId:replacementId,
                    type: "replacement",
                    reason: reqReason,
                    slot:reqSlot,
                    location:reqLocation,
                    course:courseId,
                    day:reqDay
                });
                return res.status(200).send(request);
            }else{
                return res.status(403).send("Please choose replacement in same department and course");
            }
        }

    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/viewReplacementRequest',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var request=await requests.find({toId:userId});
        if(request){
            return res.status(200).send(request);
        }else{
            return res.status(200).send("No requests present");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }


});

router.post('/sendSlotLinkingRequest',async(req,res)=>{
    try{
        var sendingId=req.headers.payload.id;
        var courseId=req.body.course;
        var reqSlot=req.body.slot;
        var reqDay=req.body.day;
        var reqLocation=req.body.location;
        var course=await courses.findOne({name: courseId});
        if(course){
            var reqSlotValid=await slots.findOne({course:courseId,slot:reqSlot,location:reqLocation,day:reqDay});
            if(reqSlotValid){
                var sendTo=course.coordinator;
                var request=await requests.create({
                    fromId: sendingId,
                    toId:sendTo,
                    type: "slotLinking",
                    slot:reqSlot,
                    location:reqLocation,
                    course:courseId,
                    day:reqDay
                });
                return res.status(200).send(request);
            }else{
                return res.status(404).send("Slot not found");
            }
        }else{
            return res.status(404).send("Course not found");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.post('/sendChangeDayOffRequest',async(req,res)=>{
    try{
        var sendingId=req.headers.payload.id;
        var reqReason=req.body.reason;
        var sending=await academicMembers.findOne({id:sendingId});
        var departmentReq=sending.department;
        var hod=await departments.find({name:departmentReq});
        if(hod){
            if(!reqReason){
                reqReason="";
            }
            var request=await requests.create({
                fromId: sendingId,
                toId:replacementId,
                type: "changeDayOff",
                reason: reqReason
            });
            return res.status(200).send(request);

        }else{
            return res.status(404).send("HOD not found");

        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.get('/viewRequests',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var request=await requests.find({fromId:userId});
        if(request){
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
        var request=await requests.find({fromId:userId,status:reqStatus});
        if(request){
            return res.status(200).send(request);
        }else{
            return res.status(200).send("No submitted requests present");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }


});

//add code
router.post('/sendLeaveRequest',async(req,res)=>{
    try{
        var sendingId=req.headers.payload.id;
        var reqReason=req.body.reason;
        var leaveType=req.body.leave;
        var sending=await academicMembers.findOne({id:sendingId});
        var departmentReq=sending.department;

        var dept=await departments.find({name:departmentReq});
        const hod= dept.HOD;
        if(hod){
            if(leaveType=="Compensation" && reqReason==undefined){
                return res.status(400).send("Please provide reason for compensation leave");
            }else{
                if(reqReason==undefined){
                    reqReason="";
                }
                var request=await requests.create({
                    fromId: sendingId,
                    toId:replacementId,
                    type: "replacement",
                    reason: reqReason
                });
                return res.status(200).send(request);

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
    var request=await requests.findOne({_id:reqId});
    if(request){
        var todayDate=new Date();
        todayDate.setHours(0,0,0);
        if(request.status=="Pending"||request.date>todayDate){
            var request=await requests.findOneAndDelete({_id:reqId});
            return res.status(200).send(request);
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
        var userId=req.headers.params.id;
        var scheduleSlots= await slots.find({id:userId});
        var scheduleReplacements=await requests.find({toId:userId,status:"Accepted"});
        var schedule={};
        if(scheduleSlots){
            schedule.slots=scheduleSlots;
            if(scheduleReplacements){
                schedule.replacements=scheduleReplacements;
            }
            res.status(200).send(schedule);
        }else{
            res.status(200).send("No teaching activities");
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

module.exports = router;