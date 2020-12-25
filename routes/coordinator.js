const express=require('express');
const router=express.Router();
const slot=require('../models/slot');
const request=require('../models/requests');
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const idDb = require('../models/id');
const validations = require('../validations/coordinator');
const Joi = require('joi');




const validateBody =(req, res,next)  =>  { try{ 
  let result;
switch(req.path){
  case '/addSlot':result = validations.addSlot.validate(req.body); 
  break;
  case '/editSlot':result = validations.EditSlot.validate(req.body); 
  break;
  case '/replyRequest':result = validations.replyRequest.validate(req.body); 
  break;
  // case '/assignCourseCordinator':result = validations.assignCourseCoordinator.validate(req.body); 
  // break;
  // case '/sendChangeDayOffRequest':result = validations.sendChangeDayOffRequest.validate(req.body); 
  // break;
  // case '/sendLeaveRequest':result = validations.sendLeaveRequest.validate(req.body); 
  // break;
 // case '/addCourse':result = validations.AddCourse.validate(req.body); 
 // break;
 // case '/signIn':result = validations.SignIn.validate(req.body); 
 // break;
 // case '/signOut':result = validations.SignOut.validate(req.body); 
 // break;

}

  const { value, error } = result; 
  const valid = error == null; 
  if (!valid) { 
    res.status(422).send( 'Validation error: Please make sure all required fields are given') 
  } else { 
next();
  }  
}
catch(err){
  console.log(err);
  res.status(405).send("Validation error: Please make sure all required fields are given");
}}



// Add 1 slot do we need another for many slots??

//need to check that the instructor & location & course exists
router.route('/addSlot').post(validateBody, (req, res) => {
    if(req.body.slot==undefined ||  req.body.day==undefined || req.body.location==undefined||req.body.course==undefined || req.body.instructor==undefined){
        res.status(300).send("Error:Missing Fields");
    }
slot.findOne({slot: req.body.slot, day: req.body.day, location: req.body.location}).then(result =>{
  if (result){res.status(300).send("Can't Create Slot: Location already taken at that time");}
  else {

    staffMember.findOne({id:req.body.instructor}).then((staff)=>{
        if(!staff){
res.status(300).send("Instructor doesn't exist ");
        }
        location.findOne({room:req.body.location}).then((loc)=>{
            if(!loc){
                res.status(300).send("Location doesn't exist ");
            }
            course.findOne({name:req.body.course}).then((course)=>{
                if(!course){
                     res.status(300).send("Course doesn't exist ");
                }
                 let newId;
    idDb.findOne({name:"slot"}).then(idSlot =>{
        newId= idSlot.count+1;
      return slot.create({id:newId,course:req.body.course, slot: req.body.slot, day: req.body.day, instructor:req.body.instructor,location: req.body.location});
    }).then(()=>{
        idDb.updateOne({name:"slot"},{$set:{count:newId}}).then(()=>{
            res.status(200).send("Successfully created");
        })
    });

            })
        })
    })


  }
}).catch(err => {
    res.status(500).send(`Server Error:${err} `);
})

 });



function checkCourse(coursen,res){
  return new Promise((resolve, reject) => {
      course.findOne({name:coursen}).then(courseNew=>{
        console.log("Course",courseNew);
           if(courseNew){  resolve();
           
           }
           else {
            reject( 
              // res.status(301).send("Course doesn't exist")
              );
           }
         });
  });
}

function checkInstr(instructor,res){
  return new Promise((resolve, reject) => {
        staffMember.findOne({id:instructor}).then((staff)=>{
        if(staff){resolve();

}reject();


        });
  });
}

function checkLoc(locationn,res){
  return new Promise((resolve, reject) => {
    location.findOne({room:locationn}).then((loc)=>{
        console.log(loc);
            if(loc){
              resolve(); 
            } reject();
        });
  });
}

router.route('/editSlot').put(validateBody,(req, res) => {
    if(req.body.id==undefined){
        res.status(300).send("Error: ID not Given");
    }
    const toEdit= {}
    const arrayofPromises=[];
    if(req.body.course){
        toEdit.course=req.body.course;
arrayofPromises.push(checkCourse(req.body.course));
    }
      if(req.body.slot){
        toEdit.slot=req.body.slot;
    }
      if(req.body.day){
        toEdit.day=req.body.day;
    }
      if(req.body.instructor){
        toEdit.instructor=req.body.instructor;
      arrayofPromises.push(checkInstr(req.body.instructor));
    }
        if(req.body.location){
        toEdit.location=req.body.location;
         arrayofPromises.push(checkLoc(req.body.location));
        }
    
Promise.all(arrayofPromises).then(()=>{
slot.findOne({id:req.body.id}).then(oldSlot =>{
    console.log("Old Slot",oldSlot);
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
}).catch(err=>{
   res.status(300).send("Error: one of the given Fields Doesn't exist");  
})

    

 });


router.route('/deleteSlot/:id').delete((req, res) => {
 slot.deleteOne({id:req.params.id}).then(result => {
   if(res.params.id==undefined){
    
      return  res.status(300).send("Undefined ID");
     
   }
   res.send("Slot successfuly deleted");
 }).catch (err=>{
   res.send(err);
 })
 });



router.route('/slotRequests').get((req, res) => {
  request.find({ toId:req.headers.payload.id}).then(result =>{
res.status(200).send(result);       
    }).catch(err=>{
        res.status(500).send("Database Error");
    });
});


router.route('/replyRequest').post(validateBody, (req, res) => {
    if(req.body.slotId==undefined ||req.body.fromId==undefined|| req.body.status==undefined){
        res.status(301).send("ERROR: Incomplete Requiured fields");
    }

   request.findOneAndUpdate({slotId:req.body.slotId,toId:req.headers.payload.id ,fromId:req.body.fromId,type:"slotLinking" },{$set:{status:req.body.status}}, {
          new: true,
        }).then(result =>{
  console.log(result);
  if(!result){
      res.status(301).send("Error: Slot Request with the given fields doesn't exist ");
  }
if(req.body.status=="Accepted"){
  slot.findOne({id: req.body.slotId}).then((slott)=>{
    if(slott.instructor){
      res.status(300).send("ERROR: Slot already assigned to an instructor");

    }
    slot.findOneAndUpdate({id: req.body.slotId},{$set:{instructor:result.fromId}}).then(slotRes =>{
    if(slotRes){
    res.status(200).send("Succesffuly linked");}
    else {
         res.status(300).send("Slot not found");
    }
});

  })

}
else {
    res.status(200).send("Succesffuly Rejected the following request ");

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