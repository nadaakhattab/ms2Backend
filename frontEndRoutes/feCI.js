const express = require('express');
const router = express.Router();
const department = require('../models/department');
const staffMembers= require('../models/staffMember');
const courses = require('../models/course');
const academicMember=require('../models/academicMember');

router.route('/getMyCourses').get(async(req,res)=>{
    let myId=req.headers.payload.id;
    console.log("ID:"+myId);
    let c= await courses.find();
    c=c.filter((course)=>{
       return  course.instructors.includes(myId);
    })
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Courses to show");
    }
})

router.route('/getCourse/:cId').get(async(req,res)=>{
    var c= await courses.findOne({name: req.params.cId});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No course to show");
    }
})

router.route('/getDepartment/:dId').get(async(req,res)=>{
    var dep= await department.findOne({name: req.params.dId});
    if(dep){
        return res.status(200).send(dep);
    }else{
       return  res.status(400).send("No departments to show");
    }
})


// router.route('/getUser').get(async(req,res)=>{
//     var myId=req.headers.payload.id;
//     console.log("ID:"+myId);
//     var user= await staffMembers.findOne({id: myId});
//     if(user){
//         return res.status(200).send(user);
//     }else{
//        return  res.status(400).send("No departments to show");
//     }
// })


router.route('/getMember/:id').get(async(req,res)=>{
    var user= await staffMembers.findOne({id: req.params.id});
    if(user){
        return res.status(200).send(user);
    }else{
       return  res.status(400).send("No departments to show");
    }
})

module.exports=router;