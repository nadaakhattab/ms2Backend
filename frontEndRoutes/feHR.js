const express = require('express');
const router = express.Router();
const department = require('../models/department');
const staffMember= require('../models/staffMember');
const courses = require('../models/course');
const academicMember=require('../models/academicMember');
const location = require('../models/location');
const faculty = require('../models/faculty');

router.route('/getAllCourses').get(async(req,res)=>{
    let c= await courses.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Courses to show");
    }
})

router.route('/getAllFaculties').get(async(req,res)=>{
    let c= await faculty.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No faculties to show");
    }
})

router.route('/getAllDepartments').get(async(req,res)=>{
    let c= await department.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No departments to show");
    }
})

router.route('/getAllLocations').get(async(req,res)=>{
    let c= await location.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No locations to show");
    }
})

router.route('/getAllStaffMember').get(async(req,res)=>{
    let c= await staffMember.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No members to show");
    }
})

router.route('/getLocation/:lId').get(async(req,res)=>{
    console.log(req.params.lId);
    let c= await location.findOne({room:req.params.lId});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No location to show");
    }
})

router.route('/getFaculty/:fId').get(async(req,res)=>{
    let c= await faculty.findOne({name:req.params.fId});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No faculty to show");
    }
})

router.route('/getStaffMember/:Id').get(async(req,res)=>{
    let c= await staffMember.findOne({id:req.params.Id});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No member to show");
    }
})

router.route('/getDepartment/:dId').get(async(req,res)=>{
    let c= await department.findOne({name:req.params.dId});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No department to show");
    }
})

router.route('/getAllHOD').get(async(req,res)=>{
    let c= await staffMember.find({type:"HOD"});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Courses to show");
    }
})

router.route('/getCourse/:cId').get(async(req,res)=>{
    let c= await courses.findOne({name:req.params.cId});
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Course to show");
    }
})



module.exports=router;