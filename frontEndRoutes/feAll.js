const express = require('express');
const router = express.Router();
const department = require('../models/department');
const staffMembers= require('../models/staffMember');
const courses = require('../models/course');
const notifications = require('../models/notification');
const academicMember=require('../models/academicMember');

router.route('/getDetails').get(async(req,res)=>{
    var myId=req.headers.payload.id;
    console.log(myId)
    var det= await academicMember.findOne({id: myId});
    console.log(det)
    if(det){
        return res.status(200).send(det);
    }else{
       return  res.status(400).send("No data to show");
    }

});

router.route('/removeNotification/:nId').get(async(req,res)=>{
    let notId=this.reqs.params.nId;
    var update=await notifications.findOneAndUpdate({_id:notId},{removed:true})
})

router.route('/seenNotification/:nId').get(async(req,res)=>{
    let notId=this.reqs.params.nId;
    var update=await notifications.findOneAndUpdate({_id:notId},{seen:true})
})

module.exports=router;