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
const academicMember=require('../models/academicMember');
const validations = require('../validations/ci');
const Joi = require('joi');


const validateBody =(req, res,next)  =>  { try{ 
    let result;
  switch(req.path){
    case '/assignSlot':result = validations.assignSlot.validate(req.body); 
    break;
    case '/updateSlot':result = validations.updateSlot.validate(req.body); 
    break;
    case '/assignCourseCordinator':result = validations.assignCourseCoordinator.validate(req.body); 
    break;
    // case '/sendChangeDayOffRequest':result = validations.sendChangeDayOffRequest.validate(req.body); 
    // break;
    // case '/sendLeaveRequest':result = validations.sendLeaveRequest.validate(req.body); 
    // break;
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



router.post('/assignSlot',async(validateBody,(req,res)=>{
        try{
            var userId=req.headers.payload.id;
            var idToAssign=req.body.staffId;
            var courseName=req.body.courseName;
            var slotId=req.body.slotId;
            if(!idToAssign||!courseName||!slotId){
                return res.status(400).send("Please provide course name and ta and slot id");
            }else{
                var courseV=await course.findOne({name:courseName});
                if(courseV){
                    if(courseV.instructors){
                        if(courseV.instructors.length>0){
                            if(courseV.instructors.includes(userId)){
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

                        }else{
                            return res.status(400).send("No instructors")

                        }

                    }else{
                        return res.status(400).send("No instructors")

                    }

                }else{
                    return res.status(400).send("Invalid course")

                }

            }
        }catch(error){
            return res.status(500).send(error.message);
        }
    
    
    }));

router.post('/updateSlot',async(validateBody,(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var idToAssign=req.body.staffId;
        var courseName=req.body.courseName;
        var oldSlotId=req.body.oldSlotId;
        var newSlotId=req.body.newSlotId;
        if(!idToAssign||!courseName||!oldSlotId||!newSlotId){
            return res.status(400).send("Please provide course name and ta and slot id");
        }else{
            var courseV=await course.findOne({name:courseName});
            if(courseV){
                console.log(courseV.instructors);
                if(courseV.instructors){
                    if(courseV.instructors.length>0){
                        if(courseV.instructors.includes(userId)){
                            var user=await staffMember.findOne({id: idToAssign});
                            if(user){
                                if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                                    var slotsV=await slot.findOne({id:oldSlotId,instructor:idToAssign,course:courseName});
                                    console.log(slotsV);
                                    if(slotsV){
                                        var newSlots=await slot.findOne({id:newSlotId});
                                        if(newSlots){
                                            if(newSlots.course==courseName){
                                                if(newSlots.instructor){
                                                    return res.status(400).send("Slot assigned to another TA");       
                                                }else{
                                                    var deleteSlot=await slot.findOneAndUpdate({id:oldSlotId},
                                                        {instructor: null},{new:true})
                                                    var slots=await slot.findOneAndUpdate({id:newSlotId},
                                                        {instructor: idToAssign},{new:true});
                                                        return res.status(200).send(slots);
                                                    
                                                }
                        
                                            }else{
                                                return res.status(400).send("Slot assigned to another course");
                        
                                            }
                
                                        }else{
                                            return res.status(404).send("New slot id not found");
    
                                        }
                
                    
                                    }else{
                                        return res.status(401).send("Invalid slot or input instructor does not teach chosen slot");
                    
                                    }
                                }else{
                                    return res.status(400).send("Id to assign must be an academic member");
                                }

                            }else{
                                return res.status(401).send("Invalid id");

                            }

            
                        }else{
                            return res.status(400).send("Can only assign in your course");
                        }
    
                    }else{
                        return res.status(400).send("No instructors")
    
                    }

                }else{
                    return res.status(400).send("Course has no instructors")

                }



            }else{
                return res.status(400).send("Invalid course")
            }

        }
    }catch(error){
        return res.status(500).send(error.message);
    }

}));

router.delete('/deleteSlot/:course/:staffId/:oldSlotId',async(req,res)=>{
    try{
        var userId=req.headers.payload.id;
        var idToAssign=req.params.staffId;
        var courseName=req.params.course;
        var oldSlotId=req.params.oldSlotId;
        if(!idToAssign||!courseName||!oldSlotId){
            return res.status(400).send("Please provide course name and ta and slot id");
        }else{
            var courseV=await course.findOne({name:courseName});
            if(courseV){
                if(courseV.instructors){
                    if(courseV.instructors.length>0){
                        if(courseV.instructors.includes(userId)){
                            var user=await staffMember.findOne({id: idToAssign});
                            if(user){
                                if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                                    var slotX=await slot.findOne({id:oldSlotId,instructor:idToAssign,course:courseName});
                                    console.log(slotX);
                                    if(slotX){
                                        var slotsV=await slot.findOneAndUpdate({id:oldSlotId,instructor:idToAssign},{instructor:null},{new:true});
                                        if(slotsV){
                                            return res.status(200).send(slotsV);
                    
                                        }else{
                                            return res.status(401).send("Invalid slot");
                    
                                        }
    
                                    }else{
                                        return res.status(401).send("Invalid slot or input instructor does not teach chosen slot");
    
                                    }
    
                                    
                
                                }else{
                                    return res.status(400).send("Id to assign must be an academic member");
                                }

                            }else{
                                return res.status(401).send("Invalid id");

                            }

            
                        }else{
                            return res.status(400).send("Can only assign in your course");
                        }

                    }else{
                        return res.status(400).send("No instructors")

                    }

                }else{
                    return res.status(400).send("No instructors")

                }

            }else{
                return res.status(400).send("Invalid course")
                
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
        if(!idToAssign||!courseName){
            return res.status(400).send("Please provide course name and ta and slot id");
        }else{
            var courseV=await course.findOne({name:courseName});
            if(courseV){
                if(courseV.instructors){
                    if(courseV.instructors.length>0){
                        if(courseV.instructors.includes(userId)){
                            var user=await staffMember.findOne({id: idToAssign});
                            if(user){
                                if(user.type=="TA"||user.type=="CI"||user.type=="CC"){
                                    switch(user.type){
                                        case "TA":{
                                            var tas=courseV.TAs.filter(function(ta){
                                                return ta!=idToAssign;
                                            })
                                            var updatedC=await course.findOneAndUpdate({name:courseName},{TAs:tas});
    
                                        };break;
                                        case "CI":{
                                            var tas=courseV.instructors.filter(function(ta){
                                                return ta!=idToAssign;
                                            })
                                            var updatedC=await course.findOneAndUpdate({name:courseName},{instructors:tas});
    
                                        };break;
                                        case "CC":{
                                            var tas=courseV.TAs.filter(function(ta){
                                                return ta!=idToAssign;
                                            })
                                            var updatedC=await course.findOneAndUpdate({name:courseName},{TAs:tas,coordinator:null});
    
    
                                        };break;
                                    }
                                    var slotsV=await slot.updateMany({instructor:idToAssign,course:courseName},{instructor:null});
                                    var academicMemberDelete=await academicMember.deleteMany({id:idToAssign,course:courseName});
                                    return res.status(200).send("Successfully removed");                               
                
                                }else{
                                    return res.status(400).send("Id to assign must be an academic member");
                                }

                            }else{
                                return res.status(400).send("Invalid id");

                            }

            
                        }else{
                            return res.status(400).send("Can only assign in your course");
                        }

                    }else{
                        return res.status(400).send("No instructors")
                        
                    }

                }else{
                    return res.status(400).send("No instructors")

                }

            }else{

                return res.status(400).send("Invalid course")
            }


        }
    }catch(error){
        return res.status(500).send(error.message);
    }

})

router.post('/assignCourseCordinator',async(validateBody,(req,res)=>{
        
        try{
            var userId=req.headers.payload.id;
            var courseName=req.body.courseId;
            var idToAssign=req.body.id;
            if(!idToAssign||!courseName){
                return res.status(400).send("Please provide course name and ta id");
            }else{
                var courseV=await course.findOne({name:courseName})
                
                if(courseV){
                    if(courseV.instructors){
                        if(courseV.instructors.length>0){
                            if(courseV.instructors.includes(userId)){
                                var user=await staffMember.findOne({id: idToAssign});
                                if(user){
                                    if(user.type=="TA"){
                                        if(courseV.TAs){
                                            if(courseV.TAs.length>0){
                                                if(courseV.TAs.includes(idToAssign)){
                                                    var courseV=await course.findOneAndUpdate({name:courseName},{coordinator: idToAssign},{new:true});
                                                    return res.status(200).send(courseV);

                                                }else{
                                                    return res.status(400).send("Course coordinator must be a TA in chosen course");

                                                }
                                            }else{
                                                return res.status(400).send("No TAs")

                                            }
                                        }else{
                                            return res.status(400).send("No TAs")

                                        }
                 

                                    }else{
                                        return res.status(400).send("Course coordinator must be a TA");
                                    }
                                }else{
                                    return res.status(401).send("Invalid id");
                                }
                            }else{
                                return res.status(400).send("Can only assign in your course");
                            }

                        }else{
                            return res.status(400).send("No instructors")

                        }

                    }else{
                        return res.status(400).send("No instructors")

                    }

                }else{
                    return res.status(400).send("Invalid course")

                }

            }
        }catch(error){
            return res.status(500).send(error.message);
        }
    
    
    }))

    let assignedCourse=0;
    function checkSlots(slot,i){
      return new Promise((resolve, reject) => {
    
         if(slot.instructor){
             assignedCourse++;
      resolve();
       }else{
      resolve();
       }
     
     
      });
    }
    
     let courseCov={};
    function checkCourseCov(coursei,i){
      return new Promise((resolve, reject) => {
    console.log(coursei.course);
     slot.find({course:coursei.course}).then((slots)=>{
     console.log("SLOTS",slots);
         if(slots){
            
             const arrayofPromises=[];
        for(let i=0;i<slots.length;i++){
            
            arrayofPromises.push(
            checkSlots(slots[i]),coursei.course);
        }
        Promise.all(arrayofPromises).then(()=>{
            
            courseCov[coursei.course]=(assignedCourse/slots.length)*100;
              assignedCourse=0; 
              console.log(courseCov);
            resolve();
        }).catch(()=>{reject()});
        }
          else{
            resolve();  
          }
         
     }).catch(()=>{
         reject()});
      });
    }
    
    
    
    
    router.route('/viewCoverage').get((req, res) => {
        try{
            courseCov={};
        console.log(req.headers.payload.id);
        academicMember.find({id: req.headers.payload.id}).then((listOfcourses)=>{
            console.log(listOfcourses);
            if(listOfcourses){
           
            const arrayofPromises=[];
              for (let i=0; i<listOfcourses.length;i++){
       console.log("members: ",listOfcourses[i]);
           arrayofPromises.push( checkCourseCov(listOfcourses[i],i));
              }
           
    
              Promise.all(arrayofPromises).then(()=>{
                  console.log(courseCov);
                  res.status(200).send(courseCov);
              }).catch(err=>{
                  res.status(500).send("Server Error");
              })
            
    
            }
            else{
     return res.status(300).send("No courses exists");
            }
    
    
        });
        }
        catch(error){
            return res.status(500).send(error.message);
        }
       });
    
    let allSlotsInCourse={}
       function checkCourseAssig(coursei,i){
      return new Promise((resolve, reject) => {
    console.log(coursei.course);
     slot.find({course:coursei.course}).then((slots)=>{
     console.log("SLOTS",slots);
         if(slots){
            
       allSlotsInCourse[coursei.course]=slots;
       resolve();
        }
          else{
            resolve();  
          }
         
     }).catch(()=>{
         reject()});
      });
    }
    
       router.route('/viewSlotsAssignment').get((req, res) => {
        try{
        console.log(req.headers.payload.id);
        academicMember.find({id: req.headers.payload.id}).then((listOfCourseAssig)=>{
            console.log(listOfCourseAssig);
            if(listOfCourseAssig){
            allSlotsInCourse={};
    
                 const arrayofPromises=[];
              for (let i=0; i<listOfCourseAssig.length;i++){
       console.log("members: ",listOfCourseAssig[i]);
           arrayofPromises.push( checkCourseAssig(listOfCourseAssig[i],i));
              }
           
    
              Promise.all(arrayofPromises).then(()=>{
                  console.log(allSlotsInCourse);
                  res.status(200).send(allSlotsInCourse);
              }).catch(err=>{
                  res.status(500).send("Server Error");
              })
    
    
            }
       });
        }
            catch(error){
                return res.status(500).send(error.message);       
            }
           });
    
    
    
    
             let saveRes={};
           function addStaff(members,i){
      return new Promise((resolve, reject) => {
     staffMember.findOne({id:members.id}).then((profile)=>{
         saveRes[i]=profile; 
          console.log("profile ",profile);
         resolve();
     }).catch(()=>{
         reject()});
      });
    }
    
    let finalCourseWithstaff={};
       function getStaffCourse(coursei,i){
      return new Promise((resolve, reject) => {
           saveRes={};
    console.log(coursei.course);
     academicMember.find({course:coursei.course}).then((members)=>{
     console.log("SLOTS",members);
         if(members){
            
    //Loop on All members in this course
            const arrayofPromises=[];
                    for(let i=0; i<members.length;i++){
                         arrayofPromises.push( addStaff(members[i],i));
                    }
    
    
                    Promise.all(arrayofPromises).then(()=>{
                        finalCourseWithstaff[coursei.course]=saveRes;
                        saveRes={};
                               resolve();
                            }).catch(err=>{
                                reject();
                            })
    
    
        }
          else{
            resolve();  
          }
         
     }).catch(()=>{
         reject()});
      });
    }
    
           router.route('/viewStaff').get((req, res) => {
            try{
                finalCourseWithstaff={};
            console.log(req.headers.payload.id);
            academicMember.find({id: req.headers.payload.id}).then((course)=>{
    
                console.log(course);
                //Loop on courses el hwa fyha 
                if(course){
               const arrayofPromises=[];
                    for(let i=0; i<course.length;i++){
                         arrayofPromises.push( getStaffCourse(course[i],i));
                    }
    
    
                    Promise.all(arrayofPromises).then(()=>{
                                console.log(finalCourseWithstaff);
                                res.status(200).send(finalCourseWithstaff);
                            }).catch(err=>{
                                res.status(500).send("Server Error");
                            })
                }
                
        
            });
            }
            catch(error){
                return res.status(500).send(error.message);       
            }
           })







router.route('/addTA').post( async(req, res) => {
            try{
                var myId=req.headers.payload.id;
                var inputCourse=req.body.course;
                var inputInstructor=req.body.ta;
                if(!inputCourse||!inputInstructor){
                    return res.status(400).send("Please provide ta and course id");
                }else{
                    // var dep=await department.findOne({HOD: myId});
                    var dep = await academicMember.findOne({id:myId, course:inputCourse});
                    if(dep){
                        var instructor=await staffMember.findOne({id:inputInstructor,type:"TA"});
                        if(instructor){
                            var vCourse=await course.findOne({name:inputCourse});
                            if(vCourse){
                                var newInstructors=vCourse.TAs;
                                newInstructors.push(inputInstructor);
                                var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                                if(updated){
                                    var academicMembers=await academicMember.create({
                                        id:inputInstructor,
                                        course:inputCourse,
                                        department:dep.name,
                                        faculty: dep.faculty
                                    });
                                  
                                        return res.status(200).send(updated);
        
                                    
        
                                }else{
                                    return res.status(500).send("Error adding course TA");
        
                                }
          
                            }else{
                                return res.status(400).send("Invalid course");
                                
                            }
        
                        }else{
                            return res.status(400).send("Invalid TA");
                        }
                    }else{
                        return res.status(404).send("Cannot find department");
        
                    }
        
                }
        
            }catch(error){
                return res.status(500).send(error.message);
            }
        
        
    }); 
    
router.route('/deleteTA/:course/:ta').delete(async(req, res) => {
        try{
            var myId=req.headers.payload.id;
            var inputCourse=req.params.course;
            var inputInstructor=req.params.ta;
            if(!inputCourse||!inputInstructor){
                return res.status(400).send("Please provide instructor and course id");
            }else{
                // var dep=await department.findOne({HOD: myId});
                 var dep = await academicMember.findOne({id:myId, course:inputCourse});
                if(dep){
                    var inputInst=await staffMember.findOne({id:inputInstructor,type:"TA"});
                    if(inputInst){
                        var vCourse=await course.findOne({name:inputCourse});
                        if(vCourse){
                            var newInstructors=vCourse.TAs;
                            newInstructors=newInstructors.filter(function(input){
                                return input!=inputInstructor;
                            });
                            var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                            if(updated){
    
                                var academicMembersRemove=await academicMember.findOneAndDelete({
                                    id:inputInstructor,
                                    course:inputCourse,
                                    department:dep.name,
                                    faculty:dep.faculty
                                })
    
                                return res.status(200).send(updated);
    
                            }else{
                                return res.status(500).send("Error adding course ta");
    
                            }
    
                        }else{
                            return res.status(400).send("Invalid course");
    
                        }
                    }else{
                        return res.status(400).send("Invalid ta");
    
                    }
    
    
                }else{
                    return res.status(404).send("Cannot find department");
    
                }
    
            }
    
    
        }catch(error){
            return res.status(500).send(error.message);
        }
    
        });  




module.exports=router;