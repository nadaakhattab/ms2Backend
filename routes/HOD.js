const express = require('express')
const router = express.Router()
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const slot=require('../models/slot');
const academicMember=require('../models/academicMember');
const request=require('../models/requests');
const notification=require('../models/notification');
const validations = require('../validations/HOD');
const Joi = require('joi');


const validateBody =(req, res,next)  =>  { try{ 
    let result;
  switch(req.path){
    case '/addInstructor':result = validations.addInstructor.validate(req.body); 
    break;
     case '/updateInstructor':result = validations.updateInstructor.validate(req.body); 
    break;
    case '/addTA':result = validations.addTA.validate(req.body); 
    break;
    case '/acceptRequest':result = validations.acceptRequest.validate(req.body); 
    break;
    case '/rejectRequest':result = validations.rejectRequest.validate(req.body); 
    break;
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





router.route('/addInstructor').post(validateBody,async(req, res) => {
    try{
        var myId=req.headers.payload.id;
        var inputCourse=req.body.course;
        var inputInstructor=req.body.instructor;
        if(!inputCourse||!inputInstructor){
            return res.status(400).send("Please provide instructor and course id");
        }else{
            var dep= await department.findOne({HOD: myId});
            if(dep){
                var instructor=await staffMember.findOne({id:inputInstructor,type:"CI"});
                if(instructor){
                    var vCourse=await course.findOne({name:inputCourse});
                    if(vCourse){
                        var newInstructors=vCourse.instructors;
                        newInstructors.push(inputInstructor);
                        var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                        if(updated){
                            var academicMembers=await academicMember.create({
                                id:inputInstructor,
                                course:inputCourse,
                                department:dep.name,
                                faculty: dep.faculty
                            });
                          
                                return res.status(200).send(updated);

                            

                        }else{
                            return res.status(500).send("Error adding course instructor");

                        }
  
                    }else{
                        return res.status(400).send("Invalid course");
                        
                    }

                }else{
                    return res.status(400).send("Invalid instructor");
                }
            }else{
                return res.status(404).send("Cannot find department");

            }

        }

    }catch(error){
        return res.status(500).send(error.message);
    }


});

router.route('/updateInstructor').post(validateBody,async(req, res) => {
    try{
        var myId=req.body.instructor;
        const newCourse = req.body.course;
        var inputCourse=req.body.course;
        if(!inputCourse||!newCourse){
            return res.status(400).send("Please provide id of old instructor,new instructor and course id");
        }else{
            let oldCourse;
academicMember.findOne({id:myId}).then ((member)=>{
    oldCourse= member.course;
    // delete it from instruction list in old course
course.findOne({name:oldCourse}).then ((oldC)=>{
    const instList = oldC.instructors;
    const updatedInst =[];
    instList.forEach(element => {
        if (element!=myId){
updatedInst.push(element);
        }
        
    });
    course.findOneAndUpdate({name:oldCourse},{$set:{instructors:updatedInst}}).then ((updatedOld)=>{
        course.findOne({name:newCourse}).then ((newCou)=>{  
              // add it to instruction list in new course
const updatedNewInst= newCou.instructors;
updatedNewInst.push(myId);
course.findOneAndUpdate({name:newCourse},{$set:{instructors:updatedNewInst}},{new:true}).then((newUp)=>{
    // update academic member to be equal to old course && its dept && its faculty 
    academicMember.findOneAndUpdate({id:myId},{$set:{faculty:newUp.faculty, course:newUp.name, department:newUp.department}}).then ((updMem)=>{
        res.status(200).send("Updated succesffully");

    })
})
        });
    });
});


});
        }
    }catch(error){
        return res.status(500).send(error.message);
    }

    });

router.route('/deleteinstructor/:course/:instructor').delete(async(req, res) => {
    try{
        var myId=req.headers.payload.id;
        var inputCourse=req.params.course;
        var inputInstructor=req.params.instructor;
        if(!inputCourse||!inputInstructor){
            return res.status(400).send("Please provide instructor and course id");
        }else{
            var dep=await department.findOne({HOD: myId});
            if(dep){
                var inputInst=await staffMember.findOne({id:inputInstructor,type:"CI"});
                if(inputInst){
                    var vCourse=await course.findOne({name:inputCourse});
                    if(vCourse){
                        var newInstructors=vCourse.instructors;
                        newInstructors=newInstructors.filter(function(input){
                            return input!=inputInstructor;
                        });
                        var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                        if(updated){

                            var academicMembersRemove=await academicMember.findOneAndDelete({
                                id:inputInstructor,
                                course:inputCourse,
                                department:dep.name,
                                faculty:dep.faculty
                            })

                            return res.status(200).send(updated);

                        }else{
                            return res.status(500).send("Error adding course instructor");

                        }

                    }else{
                        return res.status(400).send("Invalid course");

                    }
                }else{
                    return res.status(400).send("Invalid instructor");

                }


            }else{
                return res.status(404).send("Cannot find department");

            }

        }


    }catch(error){
        return res.status(500).send(error.message);
    }

    });

router.route('/addTA').post( validateBody,async(req, res) => {
            try{
                var myId=req.headers.payload.id;
                var inputCourse=req.body.course;
                var inputInstructor=req.body.ta;
                if(!inputCourse||!inputInstructor){
                    return res.status(400).send("Please provide ta and course id");
                }else{
                    var dep=await department.findOne({HOD: myId});
                    if(dep){
                        var instructor=await staffMember.findOne({id:inputInstructor,type:"TA"});
                        if(instructor){
                            var vCourse=await course.findOne({name:inputCourse});
                            if(vCourse){
                                var newInstructors=vCourse.TAs;
                                newInstructors.push(inputInstructor);
                                var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                                if(updated){
                                    var academicMembers=await academicMember.create({
                                        id:inputInstructor,
                                        course:inputCourse,
                                        department:dep.name,
                                        faculty: dep.faculty
                                    });
                                  
                                        return res.status(200).send(updated);
        
                                    
        
                                }else{
                                    return res.status(500).send("Error adding course TA");
        
                                }
          
                            }else{
                                return res.status(400).send("Invalid course");
                                
                            }
        
                        }else{
                            return res.status(400).send("Invalid TA");
                        }
                    }else{
                        return res.status(404).send("Cannot find department");
        
                    }
        
                }
        
            }catch(error){
                return res.status(500).send(error.message);
            }
        
        
    }); 
    
router.route('/deleteTA/:course/:ta').delete(async(req, res) => {
        try{
            var myId=req.headers.payload.id;
            var inputCourse=req.params.course;
            var inputInstructor=req.params.ta;
            if(!inputCourse||!inputInstructor){
                return res.status(400).send("Please provide instructor and course id");
            }else{
                var dep=await department.findOne({HOD: myId});
                if(dep){
                    var inputInst=await staffMember.findOne({id:inputInstructor,type:"TA"});
                    if(inputInst){
                        var vCourse=await course.findOne({name:inputCourse});
                        if(vCourse){
                            var newInstructors=vCourse.TAs;
                            newInstructors=newInstructors.filter(function(input){
                                return input!=inputInstructor;
                            });
                            var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                            if(updated){
    
                                var academicMembersRemove=await academicMember.findOneAndDelete({
                                    id:inputInstructor,
                                    course:inputCourse,
                                    department:dep.name,
                                    faculty:dep.faculty
                                })
    
                                return res.status(200).send(updated);
    
                            }else{
                                return res.status(500).send("Error adding course ta");
    
                            }
    
                        }else{
                            return res.status(400).send("Invalid course");
    
                        }
                    }else{
                        return res.status(400).send("Invalid ta");
    
                    }
    
    
                }else{
                    return res.status(404).send("Cannot find department");
    
                }
    
            }
    
    
        }catch(error){
            return res.status(500).send(error.message);
        }
    
        });  
router.post('/acceptRequest',async(req,res)=>{
    try{
        var requestId=req.body.id;
        if(requestId){
            var requestToAccept=await request.findOne({_id:requestId});
            if(requestToAccept){
                if(requestToAccept.status=="Pending"){
                    if(requestToAccept.type=="changeDayOff"){
                        var academicMember=requestToAccept.fromId;
                        var weekday = new Array(7);
                        weekday[0] = "Sunday";
                        weekday[1] = "Monday";
                        weekday[2] = "Tuesday";
                        weekday[3] = "Wednesday";
                        weekday[4] = "Thursday";
                        weekday[5] = "Friday";
                        weekday[6] = "Saturday";
                        var updatedSlots=await slot.findOneAndDelete({instructor:academicMember,day:weekday[requestToAccept.dayToChange]});
                        var updatedStaff=await staffMember.findOneAndUpdate({id:academicMember},{dayOff:weekday[requestToAccept.dayToChange],dayOffNumber:requestToAccept.dayToChange},{new:true})
                        var acceptedRequest=await request.findOneAndUpdate({_id:requestId},{status:"Accepted"},{new:true});
                        var notify=await notification.create({
                            requestID: requestId,
                            accepted: true,
                            to:academicMember
                        });
                        return res.status(200).send(acceptedRequest);                 
                    }
                    if(requestToAccept.type=="leave"){
                        if(requestToAccept.leaveType=="Annual"||requestToAccept.leaveType=="Accidental"){
                            var days=Math.ceil(((requestToAccept.startDate).getTime()-(requestToAccept.endDate).getTime())/(1000*3600*24));
                            if((Math.floor(staffMember.annualLeaves))>=days){
                                var updatedLeaves=days-(Math.floor(staffMember.annualLeaves));
                                var updatedStaff=findOneAndUpdate({id:academicMember},{annualLeaves:updatedLeaves});
                                var acceptedRequest=await request.findOneAndUpdate({_id:requestId},{status:"Accepted"},{new:true});
                                var notify=await notification.create({
                                    requestID: requestId,
                                    accepted: true,
                                    to:academicMember
                                });
                                return res.status(200).send(acceptedRequest);
                            }else{
                                return res.status(400).send("No enough annual leaves");
                            }
                        }
    
                        
                    }
                    var acceptedRequest=await request.findOneAndUpdate({_id:requestId},{status:"Accepted"},{new:true});
                    var notify=await notification.create({
                        requestID: requestId,
                        accepted: true,
                        to:academicMember
                    });
                    return res.status(200).send(acceptedRequest);

                }else{
                    return res.status(400).send("Cannot accept request that is not pending");

                }


            }else{
                return res.status(404).send("Request not found");
            }

        }else{
            return res.status(400).send("Please provide irequest id");

        }


    }catch(error){
        return res.status(500).send(error.message);
    }

});   

router.post('/rejectRequest',validateBody,async(req,res)=>{
    try{
        var requestId=req.body.id;
        var rejectReason=req.body.reason;
        if(requestId){
            var acceptedRequest=await request.findOne({_id:requestId});
            if(acceptedRequest){
                if(acceptedRequest.status=="Pending"){
                    var req=await request.findOneAndUpdate({_id:requestId},{status:"Rejected",rejectionReason:rejectReason},{new:true});
                var academicMember=acceptedRequest.fromId;
                var notify=await notification.create({
                    requestID: requestId,
                    accepted: false,
                    to:academicMember
                });
                return res.status(200).send(req);
            }else{
                return res.status(400).send("Cannot accept request that is not pending");

            }
            }else{
                return res.status(404).send("Request not found");

            }
        }else{
            return res.status(400).send("Please provide irequest id");

        }
    }catch(error){
        return res.status(500).send(error.message);
    }       

});

let saveRes={};
function addStaff(members,i){
return new Promise((resolve, reject) => {
staffMember.findOne({id:members.id}).then((profile)=>{
saveRes[i]=profile; 
console.log("profile ",profile);
resolve();
}).catch(()=>{
reject()});
});
}

router.get('/viewStaff',(req, res) => {
 try{
     saveRes={};
 console.log(req.headers.payload.id);
 department.findOne({HOD: req.headers.payload.id}).then( (department)=>{
     console.log("dept:  ",department);
     if(department){
           
   academicMember.find({department:department.name}).then(members =>{
       let resultProf={};
     const arrayofPromises=[];
   for (let i=0; i<members.length;i++){
console.log("members: ",members[i]);
arrayofPromises.push( addStaff(members[i],i));
   }


   Promise.all(arrayofPromises).then(()=>{
       console.log(saveRes);
       res.status(200).send(saveRes);
   }).catch(err=>{
       res.status(500).send("Server Error");
   })
   });


     }
     else {
         return res.status(300).send("ERROR:NO Department belongs to Current HOD ");  
     }
     

 });
 }
 catch(error){
     return res.status(500).send(error.message);       
 }
});

let saveResDay={};
function addStaffDay(members,i){
return new Promise((resolve, reject) => {
staffMember.findOne({id:members.id}).then((profile)=>{
saveResDay[profile.id]=profile.dayOff; 
console.log("profile ",profile);
resolve();
}).catch(()=>{
reject()});
});
}

router.route('/viewdayoff').get((req, res) => {
 try{
     saveResDay={};
 console.log(req.headers.payload.id);
 department.findOne({HOD: req.headers.payload.id}).then( (department)=>{
     console.log("dept:  ",department);
     if(department){
           
   academicMember.find({department:department.name}).then(members =>{
       let resultProf={};
     const arrayofPromises=[];
   for (let i=0; i<members.length;i++){
console.log("members: ",members[i]);
arrayofPromises.push( addStaffDay(members[i],i));
   }


   Promise.all(arrayofPromises).then(()=>{
       console.log(saveResDay);
       res.status(200).send(saveResDay);
   }).catch(err=>{
       res.status(500).send("Server Error");
   })
   });


     }
     else {
         return res.status(300).send("ERROR:NO Department belongs to Current HOD ");  
     }
     

 });
 }
 catch(error){
     return res.status(500).send(error.message);       
 }
});


let saveReq={};
function addStaffReq(members,i){
return new Promise((resolve, reject) => {
request.findOne({fromId:members.id}).then((profile)=>{
if(profile){
saveReq[i]=profile; 
console.log("profile ",profile);}
resolve();
}).catch(()=>{
reject()});
});
}

router.route('/viewrequests').get((req, res) => {
 try{
     saveReq={};
 console.log(req.headers.payload.id);
 department.findOne({HOD: req.headers.payload.id}).then( (department)=>{
     console.log("dept:  ",department);
     if(department){
           
   academicMember.find({department:department.name}).then(members =>{
       let resultProf={};
     const arrayofPromises=[];
   for (let i=0; i<members.length;i++){
console.log("members: ",members[i]);
arrayofPromises.push( addStaffReq(members[i],i));
   }


   Promise.all(arrayofPromises).then(()=>{
       console.log(saveReq);
       res.status(200).send(saveReq);
   }).catch(err=>{
       res.status(500).send("Server Error");
   })
   });


     }
     else {
         return res.status(300).send("ERROR:NO Department belongs to Current HOD ");  
     }
     

 });
 }
 catch(error){
     return res.status(500).send(error.message);       
 }
 });


let assignedCourse=0;
function checkSlots(slot,i){
return new Promise((resolve, reject) => {

if(slot.instructor){
  assignedCourse++;
resolve();
}else{
resolve();
}


});
}


let courseCov={};
function checkCourseCov(course,i){
return new Promise((resolve, reject) => {

slot.find({course:course.name}).then((slots)=>{

if(slots){
  console.log("SLOTS",slots);
  const arrayofPromises=[];
for(let i=0;i<slots.length;i++){
 
 arrayofPromises.push(
 checkSlots(slots[i]),course.name);
}
Promise.all(arrayofPromises).then(()=>{
 
 courseCov[course.name]=(assignedCourse/slots.length)*100;
   assignedCourse=0; 
   console.log(courseCov);
 resolve();
}).catch(()=>{reject()});
}
else{
 resolve();  
}

}).catch(()=>{
reject()});
});
}

router.route('/viewCoverage').get((req, res) => {
 try{
     courseCov={};
 console.log(req.headers.payload.id);
 department.findOne({HOD: req.headers.payload.id}).then((depart)=>{
     console.log(depart);
     if(depart){
   course.find({department:depart.name}).then (listOfcourses=>{
       if(listOfcourses){
           
const arrayofPromises=[];
   for (let i=0; i<listOfcourses.length;i++){
console.log("members: ",listOfcourses[i]);
arrayofPromises.push( checkCourseCov(listOfcourses[i],i));
   }


   Promise.all(arrayofPromises).then(()=>{
       console.log(courseCov);
       res.status(200).send(courseCov);
   }).catch(err=>{
       res.status(500).send("Server Error");
   })




       }
       else{
      res.status(200).send("No courses available under this department"); 
       }

   });

     }
     else{
return res.status(300).send("ERROR:NO Department belongs to Current HOD "); 
     }


 });
 }
 catch(error){
     return res.status(500).send(error.message);
 }
});


router.get('/viewassignment',async (req, res) => {
 try{
 console.log(req.headers.payload.id);
 department.findOne({HOD: req.headers.payload.id}).then((department)=>{
     console.log(department);
     if(department){
             try{
             var dep= req.body.department;
             const x=dep.courses;
             // var result=await slot.findOne({course:x})
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
  
module.exports=router;