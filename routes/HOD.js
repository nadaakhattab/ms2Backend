const express = require('express')
const router = express.Router()
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const slot=require('../models/slot');
const academicMember=require('../models/academicMember');
const { request } = require('express');
const requests= require('../models/requests');




router.route('/addInstructor').post( async(req, res) => {
    try{
        var myId=req.headers.payload.id;
        var inputCourse=req.body.course;
        var inputInstructor=req.body.instructor;
        if(!inputCourse||!inputInstructor){
            return res.status(400).send("Please provide instructor and course id");
        }else{
            var dep=await department.findOne({HOD: myId});
            if(dep){
                var instructor=await staffMember.findOne({id:inputInstructor,type:"CI"});
                if(instructor){
                    var vCourse=await course.findOne({name:inputCourse});
                    if(vCourse){
                        var newInstructors=vCourse.instructors;
                        newInstructors.push(inputInstructor);
                        var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                        if(updated){
                            var academicMembers=await academicMember.create({
                                id:inputInstructor,
                                course:inputCourse,
                                department:dep.name,
                                faculty: dep.faculty
                            });
                            if(academicMembers){
                                return res.status(200).send(updated);

                            }

                        }else{
                            return res.status(500).send("Error adding course");

                        }
  
                    }else{
                        return res.status(400).send("Invalid course");
                        
                    }

                }else{
                    return res.status(400).send("Invalid instructor");
                }
            }else{
                return res.status(404).send("Cannot find department");

            }

        }

    }catch(error){
        return res.status(500).send(error.message);
    }


     });

router.route('/updateInstructor').put((req, res) => {
    try{

    }catch(error){

    }





        course.updateOne({instructors:req.body.instructors},{$set:{...req.body}}).then(result =>{
            // error message
            console.log(result);
            if (result.nModified!=0){
                
                res.send("edited");}
            else {
          res.send(" doesn't exist");
            }
          });
           });


      router.route('/deleteinstructor').delete((req, res) => {
        course.deleteOne({...req.body}).then(result => {
          res.send("instructor successfuly deleted");
        }).catch (err=>{
          res.send(err);
        })
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

router.get('/viewStaff',(req, res) => {
        try{
            saveRes={};
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then( (department)=>{
            console.log("dept:  ",department);
            if(department){
                  
          academicMember.find({department:department.name}).then(members =>{
              let resultProf={};
            const arrayofPromises=[];
          for (let i=0; i<members.length;i++){
   console.log("members: ",members[i]);
       arrayofPromises.push( addStaff(members[i],i));
          }
       

          Promise.all(arrayofPromises).then(()=>{
              console.log(saveRes);
              res.status(200).send(saveRes);
          }).catch(err=>{
              res.status(500).send("Server Error");
          })
          });
       

            }
            else {
                return res.status(300).send("ERROR:NO Department belongs to Current HOD ");  
            }
            
    
        });
        }
        catch(error){
            return res.status(500).send(error.message);       
        }
       });

  let saveResDay={};
       function addStaffDay(members,i){
  return new Promise((resolve, reject) => {
 staffMember.findOne({id:members.id}).then((profile)=>{
     saveResDay[profile.id]=profile.dayOff; 
      console.log("profile ",profile);
     resolve();
 }).catch(()=>{
     reject()});
  });
}

       router.route('/viewdayoff').get((req, res) => {
        try{
            saveResDay={};
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then( (department)=>{
            console.log("dept:  ",department);
            if(department){
                  
          academicMember.find({department:department.name}).then(members =>{
              let resultProf={};
            const arrayofPromises=[];
          for (let i=0; i<members.length;i++){
   console.log("members: ",members[i]);
       arrayofPromises.push( addStaffDay(members[i],i));
          }
       

          Promise.all(arrayofPromises).then(()=>{
              console.log(saveResDay);
              res.status(200).send(saveResDay);
          }).catch(err=>{
              res.status(500).send("Server Error");
          })
          });
       

            }
            else {
                return res.status(300).send("ERROR:NO Department belongs to Current HOD ");  
            }
            
    
        });
        }
        catch(error){
            return res.status(500).send(error.message);       
        }
       });


  let saveReq={};
       function addStaffReq(members,i){
  return new Promise((resolve, reject) => {
 requests.findOne({fromId:members.id}).then((profile)=>{
     if(profile){
     saveReq[i]=profile; 
      console.log("profile ",profile);}
     resolve();
 }).catch(()=>{
     reject()});
  });
}



       router.route('/viewrequests').get((req, res) => {
        try{
            saveReq={};
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then( (department)=>{
            console.log("dept:  ",department);
            if(department){
                  
          academicMember.find({department:department.name}).then(members =>{
              let resultProf={};
            const arrayofPromises=[];
          for (let i=0; i<members.length;i++){
   console.log("members: ",members[i]);
       arrayofPromises.push( addStaffReq(members[i],i));
          }
       

          Promise.all(arrayofPromises).then(()=>{
              console.log(saveReq);
              res.status(200).send(saveReq);
          }).catch(err=>{
              res.status(500).send("Server Error");
          })
          });
       

            }
            else {
                return res.status(300).send("ERROR:NO Department belongs to Current HOD ");  
            }
            
    
        });
        }
        catch(error){
            return res.status(500).send(error.message);       
        }
        });
  

        router.route('/acceptrequest').post( (req, res) => {
            requests.findOneAndUpdate({id:req.body.id},{$set:{accepted:req.body.accepted}}, {
                   new: true,
                 }).then(result =>{
           console.log(result);
         if(accepted){
         slot.findOneAndUpdate({id: req.body.id},{$set:{instructor:result.instructor}}).then(slotRes =>{
             res.status(200).send("Succesffuly linked");
         });
         }
                 }
         ).catch(err =>{
             res.status(500).send("Database Error");
         });
             
         });
         

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
function checkCourseCov(course,i){
  return new Promise((resolve, reject) => {

 slot.find({course:course.name}).then((slots)=>{

     if(slots){
         console.log("SLOTS",slots);
         const arrayofPromises=[];
    for(let i=0;i<slots.length;i++){
        
        arrayofPromises.push(
        checkSlots(slots[i]),course.name);
    }
    Promise.all(arrayofPromises).then(()=>{
        
        courseCov[course.name]=(assignedCourse/slots.length)*100;
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
        department.findOne({HOD: req.headers.payload.id}).then((depart)=>{
            console.log(depart);
            if(depart){
          course.find({department:depart.name}).then (listOfcourses=>{
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
             res.status(200).send("No courses available under this department"); 
              }

          });
  
            }
            else{
    return res.status(300).send("ERROR:NO Department belongs to Current HOD "); 
            }
  
  
        });
        }
        catch(error){
            return res.status(500).send(error.message);
        }
       });


       router.get('/viewassignment',async (req, res) => {
        try{
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then((department)=>{
            console.log(department);
            if(department){
                    try{
                    var dep= req.body.department;
                    const x=dep.courses;
                    // var result=await slot.findOne({course:x})
                    if(!result){
                        return res.status(404).send("Result not found");
                    }else{
                        return res.status(200).send(user);
                    }
                }catch(error){
                    return res.status(500).send(error.message);
                }
            }
       });
        }
            catch(error){
                return res.status(500).send(error.message);       
            }
           });
    



           module.exports=router;