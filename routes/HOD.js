const express = require('express')
const router = express.Router()
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const slot=require('../models/slot');
const academicMember=require('../models/academicMember');




router.route('/addInstructor').post( (req, res) => {
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
                    var vCourse=await course.findOne({_id:course});
                    if(vCourse){
                        var newInstructors=vCourse.instructors;
                        newInstructors.push(inputInstructor);
                        var updated=await course.findOneAndUpdate({_id:course},{instructors:newInstructors},{new:true});
                        var academicMembers=await academicMember.create({
                            id:inputInstructor,
                            course:inputCourse,
                            department:dep._id,
                            faculty: dep.faculty
                        });
    
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

    router.route('/editinstructor').put((req, res) => {
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
      


router.route('/viewStaff').get((req, res) => {
        try{
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then((department)=>{
            console.log(department);
            if(department){
                const snames= staffMember.name;
                const courses= department.courses;
                const staff=[];
                for(var i=0; i<courses.length; i++)
                {
                    course.findOne({name:courses[i]}).then((course)=>{
                        staff.push(courses[i].coordinator);
                        for(var m=0; i<courses.TAs.length;m++){
                            staff.push(courses.TAs[m]);
                        }
                        for(var j=0;j<courses.instructors.length;j++){
                            staff.push(courses.instructors[i]);
                        }
                    });
                }
                const results=[];
                for(var y=0;y<staff.length;y++)
                {
                    var depuser=staffMember.findOne({id:staff[i]}) ;
                    results.push(depuser);
                }

            }
            
    
        });
        }
        catch(error){
            return res.status(500).send(error.message);       
        }
       });

       router.route('/viewdayoff').get((req, res) => {
        try{
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then((department)=>{
            console.log(department);
            if(department){
                
                const courses= department.courses;
                const sdayoff= staffMember.dayOff;
                const staff=[];
                for(var i=0; i<courses.length; i++)
                {
                    course.findOne({name:courses[i]}).then((course)=>{
                        staff.push(courses[i].coordinator);
                        for(var m=0; i<courses.TAs.length;m++){
                            staff.push(courses.TAs[m]);
                        }
                        for(var j=0;j<courses.instructors.length;j++){
                            staff.push(courses.instructors[j]);
                        }
                    });
                }
                const results=[];
                for(var y=0;y<staff.length;y++)
                {   var depuser=staffMember.findOne({id:staff[i]}) ;
                    results.push(depuser);
                    
                }
  
            }
  
  
        });
        }
        catch(error){
            return res.status(500).send(error.message);
        }
       });


       router.route('/viewrequests').get((req, res) => {
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then((department)=>{
            console.log(department);
           if(department){
               requests.find({ departments:department.name}).then(result =>{
                   if(result){
                       res.status(200).send(result);
                   }
                   else {
                       res.send("No requests");
                   }
                   
               
            });}
        
            });
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
         


       router.route('/viewCoverage').get((req, res) => {
        try{
            
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then((department)=>{
            console.log(department);
            if(department){
                var cname= req.body.name;
                if(department.courses.includes(cname)){
                    const x= slot.findOne({course:cname}).count();
                    const y=slot.findOne({course:cname ,assigned:true}).count();
                    const result=(x/y)*100;
                    return result;
                }
                else{
                    
                }
            
  
            }
            else{

            }
  
  
        });
        }
        catch(error){
            return res.status(500).send(error.message);
        }
       });





       router.route('/viewassignment').get((req, res) => {
        try{
        console.log(req.headers.payload.id);
        department.findOne({HOD: req.headers.payload.id}).then((department)=>{
            console.log(department);
            if(department){
                    try{
                    var dep= req.body.department;
                    const x=dep.courses;
                    var result=await slot.findOne({course:x})
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