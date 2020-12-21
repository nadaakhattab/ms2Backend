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
const academicMember = require('../models/academicMember');
 const slot = require('../models/slot');

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
       });


       router.post('/assignSlot',async(req,res)=>{
        try{
            var userId=req.headers.payload.id;
            var idToAssign=req.body.id;
            var courseName=req.body.courseName;
            var dayToAssign=req.body.day;
            var slotToAssign=req.body.slot;
            var locationToAssign=req.body.slot;
            if(!idToAssign||!courseName){
                return res.status(400).send("Please provide course name and ta id");
            }else{
                var course=courses.find({name:courseName});
                if(course.instructors.includes(userId)){
                    var user=await staffMember.findOne({id: idToAssign});
                    if(user.type=="HOD"||user.type=="TA"||user.type=="CI"||user.type=="CC"){
                        var slots=await slot.findOne({location:locationToAssign,slot:slotToAssign,day:dayToAssign});
                        if(slots){
                            if(slots.course==courseName){
                                if(slots.instructor){
                                    var slots=await slot.findOneAndUpdate({location:locationToAssign,slot:slotToAssign,day:dayToAssign},
                                        {instructor: idToAssign},{new:true});
        
                                }else{
                                    return res.status(400).send("Slot assigned to another TA");
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






    

    
    

router.post('/assignCourseCoordinator',async(req,res)=>{
    try{
        var taId=req.body.id;
        var courseName=req.body.courseName;
        if(!idToAssign||!courseName){
            return res.status(400).send("Please provide course name and ta id");
        }else{
            var courses=course.find({name:courseName});
            if(course.instructors.includes(userId)){
                var user=await staffMember.findOne({id: taId});
                if(user){
                    if(user.type=="TA"){
                        var courses=await course.findOneAndUpdate({name:courseName},{coordinator: taId},{new:true});
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
});


module.exports=router;