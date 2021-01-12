const express = require('express');
const router = express.Router();
const slots=require('../models/slot');
const courses = require('../models/course');

router.route('/getSlots').get(async(req,res)=>{
    let myId=req.headers.payload.id;
    console.log("ID:"+myId);
    let courseB=await courses.findOne({coordinator:myId});
    if(courseB){
        // console.log(courseB.data)
        let allSlots=await slots.find({course:courseB.name});
        if(allSlots){
            return res.status(200).send(allSlots);
    
        }else{
            return  res.status(400).send("No slots to show");
    
        }

    }



})

router.route('/getSlot/:sId').get(async(req,res)=>{
    console.log("in get")
    let allSlots=await slots.findOne({id:req.params.sId});
    if(allSlots){
        return res.status(200).send(allSlots);

    }else{
        return  res.status(400).send("No slots to show");

    }


})


module.exports=router;