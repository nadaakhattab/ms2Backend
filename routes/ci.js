const express = require('express')
const router = express.Router()
const bcrypt=require('bcryptjs');
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const idDb = require('../models/id');
const attendance = require('../models/attendance');
const slot = require('../models/slot');
 




router.post('/assignSlot',async(req,res)=>{
        try{
            var userId=req.headers.payload.id;
            var idToAssign=req.body.staffId;
            var courseName=req.body.courseName;
            var slotId=req.body.slotId;
            if(!idToAssign||!courseName||!slotId){
                return res.status(400).send("Please provide course name and ta and slot id");
            }else{
                var course=await course.find({name:courseName});
                if(course.instructors.includes(userId)){
                    var user=await staffMember.findOne({id: idToAssign});
                    if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                        var slotsV=await slot.findOne({id:slotId});
                        if(slotsV){
                            if(slotsV.course==courseName){
                                if(slotsV.instructor){
                                    
                                        return res.status(400).send("Slot assigned to another TA");
        
                                }else{
                                    var slots=await slot.findOneAndUpdate({id:slotId},
                                        {instructor: idToAssign},{new:true});
                                    return res.status(200).send(slots);
                                    
                                }
        
                            }else{
                                return res.status(400).send("Slot assigned to another course");
        
                            }
        
                        }else{
                            return res.status(401).send("Invalid slot");
        
                        }
                    }else{
                        return res.status(400).send("Id to assign must be an academic member");
                    }
    
                }else{
                    return res.status(400).send("Can only assign in your course");
                }
            }
        }catch(error){
            return res.status(500).send(error.message);
        }
    
    
    });

router.post('/updateSlot',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var idToAssign=req.body.staffId;
        var courseName=req.body.courseName;
        var oldSlotId=req.body.oldSlotId;
        var newSlotId=req.body.oldSlotId;
        if(!idToAssign||!courseName||!oldSlotId||!newSlotId){
            return res.status(400).send("Please provide course name and ta and slot id");
        }else{
            var course=await course.find({name:courseName});
            if(course.instructors.includes(userId)){
                var user=await staffMember.findOne({id: idToAssign});
                if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                    var slotsV=await slot.findOneAndUpdate({id:oldSlotId},{instructor:null});
                    if(slotsV){
                        var newSlots=await slot.findOne({id:newSlotId});
                        if(newSlots){
                            if(newSlots.course==courseName){
                                if(newslots.instructor){
                                    return res.status(400).send("Slot assigned to another TA");       
                                }else{
                                    var slots=await slot.findOneAndUpdate({id:slotId},
                                        {instructor: idToAssign},{new:true});
                                        return res.status(200).send(slots);
                                    
                                }
        
                            }else{
                                return res.status(400).send("Slot assigned to another course");
        
                            }

                        }

    
                    }else{
                        return res.status(401).send("Invalid slot");
    
                    }
                }else{
                    return res.status(400).send("Id to assign must be an academic member");
                }

            }else{
                return res.status(400).send("Can only assign in your course");
            }
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

});

router.delete('/deleteSlot/:course/:staffId/:oldSlotId',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var idToAssign=req.params.staffId;
        var courseName=req.params.course;
        var oldSlotId=req.params.oldSlotId;
        if(!idToAssign||!courseName||!oldSlotId){
            return res.status(400).send("Please provide course name and ta and slot id");
        }else{
            var course=await course.find({name:courseName});
            if(course.instructors.includes(userId)){
                var user=await staffMember.findOne({id: idToAssign});
                if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                    var slotsV=await slot.findOneAndUpdate({id:oldSlotId},{instructor:null});
                    if(slotsV){
                        return res.status(200).send(slotsV);

                    }else{
                        return res.status(401).send("Invalid slot");

                    }
                    

                }else{
                    return res.status(400).send("Id to assign must be an academic member");
                }

            }else{
                return res.status(400).send("Can only assign in your course");
            }
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

})

router.delete('/removeFromCourse/:course/:staffId',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var idToAssign=req.params.staffId;
        var courseName=req.params.course;
        if(!idToAssign||!courseName||!oldSlotId){
            return res.status(400).send("Please provide course name and ta and slot id");
        }else{
            var course=await course.find({name:courseName});
            if(course.instructors.includes(userId)){
                var user=await staffMember.findOne({id: idToAssign});
                if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                    var slotsV=await slot.findAndUpdate({instructor:idToAssign},{instructor:null});
                    var academicMemberDelete=await academicMemberDelete.findAndDelete({instructor:idToAssign,course:courseName});
                    if(slotsV){
                        return res.status(200).send(slotsV);

                    }else{
                        return res.status(401).send("Invalid slot");

                    }
                    

                }else{
                    return res.status(400).send("Id to assign must be an academic member");
                }

            }else{
                return res.status(400).send("Can only assign in your course");
            }
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

})

router.post('/assignCourseCordinator',async(req,res)=>{
        
        try{
            var taId=req.body.id;
            var courseName=req.body.courseName;
            if(!idToAssign||!courseName){
                return res.status(400).send("Please provide course name and ta id");
            }else{
                var course=courses.find({name:courseName});
                if(course.instructors.includes(userId)){
                    var user=await staffMember.findOne({id: taId});
                    if(user){
                        if(user.type=="TA"){
                            var course=await course.findOneAndUpdate({name:courseName},{coordinator: taId},{new:true});
                            res.status(200).send(course);
                        }else{
                            return res.status(400).send("Course coordinator must be a TA");
                        }
                    }else{
                        return res.status(401).send("Invalid id");
                    }
                }else{
                    return res.status(400).send("Can only assign in your course");
                }
            }
        }catch(error){
            return res.status(500).send(error.message);
        }
    
    
    })








module.exports=router;