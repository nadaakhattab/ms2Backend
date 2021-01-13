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
    console.log("in remove");
    try{
        var update=await notifications.findOneAndUpdate({_id:req.params.nId},{removed:true})
        console.log(update);
        if(update){
            res.status(200).send("success")
        }else{
            res.status(300).send("erorr")
        }

    }catch(error){
        res.status(500).send(error);
    }

})



module.exports=router;