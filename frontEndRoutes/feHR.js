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
       return  res.status(400).send("No Courses to show");
    }
})

router.route('/getAllDepartments').get(async(req,res)=>{
    let c= await department.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Courses to show");
    }
})

router.route('/getAllLocations').get(async(req,res)=>{
    let c= await location.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Courses to show");
    }
})

router.route('/getAllStaffMember').get(async(req,res)=>{
    let c= await staffMember.find();
    if(c){
        return res.status(200).send(c);
    }else{
       return  res.status(400).send("No Courses to show");
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

module.exports=router;