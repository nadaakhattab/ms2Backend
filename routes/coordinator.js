const express=require('express');
const router=express.Router();
const slot=require('../models/slot');
const linkingRequest=require('../models/linkingRequest');
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const idDb = require('../models/id');


// add 1 slot
router.route('/addSlot').post( (req, res) => {
    // law ha-assign an instructor need to chcek that he exists first
slot.findOne({ id:req.body.id}).then(result =>{
  // error message
  if (result){res.send("SlotID already exists");}
  else {
slot.create({id:req.body.id,course:req.body.course, slot: req.body.slot, day: req.body.day, instructor:req.body.instructor}).then(result => {
         res.send(result);
     });
  }
}).catch(err => {
    res.status(500).send(`Server Error:${err} `);
})

 });




router.route('/editSlot').put((req, res) => {
slot.updateOne({id:req.body.id},{$set:{...req.body}}).then(result =>{
  // error message
  console.log(result);
  if (result.nModified!=0){ 
      res.send("edited");}
  else {
res.send("Slot doesn't exist");
  }
});
 });


router.route('/deleteSlot').delete((req, res) => {
 slot.deleteOne({id:req.body.id}).then(result => {
   res.send("Slot successfuly deleted");
 }).catch (err=>{
   res.send(err);
 })
 });



router.route('/slotRequests').get((req, res) => {
console.log(req.headers.payload.id);
    course.findOne({coordinator: req.headers.payload.id}).then((course)=>{
        console.log(course);
   if(course){
       linkingRequest.find({ course:course.name}).then(result =>{
           if(result){
               res.status(200).send(result);
           }
           else {
               res.send("No requests");
           }
           
       
    });}

    });
});


// adds slot linking request Extra remove it if done
router.route('/addRequests').post( (req, res) => {

   linkingRequest.updateOne({id:req.body.id},{$set:{accepted:req.body.accepted}}).then(result =>{
  // error message
  console.log(result);
  if (result.nModified!=0){ 

if(accepted){
    // Add it to sender schedule el hwa instructor of linkingrequest el baghayaraaha now

    
}
      res.send("edited");}
  else {
res.send("Request doesn't exist");
  }
});

 });


 router.route('/replyRequest').post( (req, res) => {
     // if accepted request --> create a slot? wla m3mola already 
linkingRequest.create({course:req.body.course, slot: req.body.slot, day: req.body.day, instructor:req.body.instructor}).then(result => {
         res.send(result);
     }).catch(err => {
    res.status(500).send(`Server Error:${err} `);
})

 });


module.exports = router;