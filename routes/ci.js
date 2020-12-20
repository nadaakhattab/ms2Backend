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
 

router.route('/viewCoverage').get((req, res) => {
    try{
        
    console.log(req.headers.payload.id);
    course.findOne({instructors: req.headers.payload.id}).then((course)=>{
        console.log(course);
        if(course){
            var id= req.body.id;
            var cname= req.body.name;
            if(course.instructors.includes(id)){
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
    course.findOne({instructors: req.headers.payload.id}).then((course)=>{
        console.log(course);
        if(course){
                try{
                var result=await slot.findOne({instructor:name})
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


       router.route('/viewStaff').get((req, res) => {
        try{
        console.log(req.headers.payload.id);
        course.findOne({instructors: req.headers.payload.id}).then((course)=>{
            console.log(course);
            if(course){
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