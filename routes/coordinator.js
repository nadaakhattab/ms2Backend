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

// Add 1 slot do we need another for many slots??

router.route('/addSlot').post( (req, res) => {
    // law ha-assign an instructor need to chcek that he exists first
slot.findOne({slot: req.body.slot, day: req.body.day, location: req.body.location}).then(result =>{
  if (result){res.status(300).send("Can't Create Slot: Location already taken");}
  else {
 let newId;
    idDb.findOne({name:"slot"}).then(idSlot =>{
        newId= idSlot.count+1;
        // {id:newId,course:req.body.course, slot: req.body.slot, day: req.body.day, instructor:req.body.instructor,location: req.body.location}
      return slot.create({...req.body});
    }).then(()=>{
        idDb.update({name:"slot"},{$set:{count:newId}}).then(()=>{
            res.status(200).send(result);
        })
    });

  }
}).catch(err => {
    res.status(500).send(`Server Error:${err} `);
})

 });




router.route('/editSlot').put((req, res) => {
    const toEdit= {}
    if(req.body.course){
        toEdit.course=req.body.course;
    }
      if(req.body.slot){
        toEdit.slot=req.body.slot;
    }
      if(req.body.day){
        toEdit.day=req.body.day;
    }
      if(req.body.instructor){
        toEdit.instructor=req.body.instructor;
    }
        if(req.body.location){
        toEdit.location=req.body.location;
    }

slot.findOne({id:req.body.id}).then(oldSlot =>{
    slot.findOne({slot:(toEdit.slot?toEdit.slot:oldSlot.slot), 
        day:(toEdit.day?toEdit.day:oldSlot.day),
         location:(toEdit.location?toEdit.location:oldSlot.location),
    }).then(similarSlot =>{
        if(similarSlot && similarSlot.id!=oldSlot.id){
            res.status(300).send("Location already taken in desired slot");
        }
else {
    slot.findOneAndUpdate({id:req.body.id},{$set:{...toEdit}},{new: true}).then(result =>{
        res.status(200).send("Success");
}).catch(err =>{
    console.log(err);
    res.status(500).send("Database Error: Can't be Updated");
});
}

    });

}).catch(err=>{
    res.status(300).send("Slot Doesn't Exist");
})
    

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


router.route('/replyRequest').post( (req, res) => {
   linkingRequest.findOneAndUpdate({id:req.body.id},{$set:{accepted:req.body.accepted}}, {
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







    // Add it to sender schedule el hwa instructor of linkingrequest el baghayaraaha now
// check that no slot exists with the same location & day & slot where instructor is set
// slot.findOne({slot: result.slot, day: result.day, location:result.location}).then(slotRes =>{
//     if(slotRes){
//         // there exists a slot
//         if (slotRes.instructor){
//                if (slotRes.instructor!== result.instructor){
//                    res.status(300).send("Can't Assign this slot. Location occupied")
//                }
//         }
//        if(slotRes.course==result.course){
// slot.updateOne({id:slotRes.id},{$set:{instructor:result.instructor}}).then(() =>{
//     res.status(200).send("Done");
// }).catch(err =>{
//     res.status(500).send("Database Error");
// })
//        } 
//     }
//     else {
//         //create a slot
//  let newId;
//     idDb.findOne({name:"slot"}).then(idSlot =>{
//         newId= idSlot.count+1;
//       return slot.create({id:newId,course:result.course, slot:result.slot, day: result.day, instructor:result.instructor,location: result.location}).then(result => {
         
//      }); 

//     }).then(()=>{
//         idDb.update({name:"slot"},{$set:{count:newId}}).then(()=>{
//             res.status(200).send(result);
//         })

//     });
//     }

module.exports = router;