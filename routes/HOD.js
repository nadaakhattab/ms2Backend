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





router.route('/addInstructor').post( async(req, res) => {
    try{
        var myId=req.headers.payload.id;
        var inputCourse=req.body.course;
        var inputInstructor=req.body.instructor;
        if(!inputCourse||!inputInstructor){
            return res.status(400).send("Please provide instructor and course id");
        }else{
            var dep=await department.findOne({HOD: myId});
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

router.route('/updateInstructor').post(async(req, res) => {
    try{
        var myId=req.headers.payload.id;
        var inputCourse=req.body.course;
        var oldInstructor=req.body.oldInstructor;
        var newInstructor=req.body.newInstructor;
        if(!inputCourse||!oldInstructor||!newInstructor){
            return res.status(400).send("Please provide instructor and course id");
        }else{
            var dep=await department.findOne({HOD: myId});
            if(dep){
                var oldInst=await staffMember.findOne({id:oldInstructor,type:"CI"});
                if(oldInst){
                    var newInst=await staffMember.findOne({id:newInstructor,type:"CI"});
                    if(newInst){
                        var vCourse=await course.findOne({name:inputCourse});
                        if(vCourse){
                            var newInstructors=vCourse.instructors;
                            newInstructors=newInstructors.filter(function(input){
                                return input!=oldInstructor;
                            });
                            newInstructors.push(newInstructor);
                            var updated=await course.findOneAndUpdate({name:inputCourse},{instructors:newInstructors},{new:true});
                            if(updated){

                                var academicMembersRemove=await academicMember.findOneAndDelete({
                                    id:oldInstructor,
                                    course:inputCourse,
                                    department:dep.name,
                                    faculty:dep.faculty
                                })
                                var academicMemberAdd=await academicMember.create({
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
                        return res.status(400).send("Invalid new instructor");
                    }

                }else{
                    return res.status(400).send("Invalid old instructor");

                }


            }else{
                return res.status(404).send("Cannot find department");

            }

        }


    }catch(error){
        return res.status(500).send(error.message);
    }





        course.updateOne({instructors:req.body.instructors},{$set:{...req.body}}).then(result =>{
            // error message
            console.log(result);
            if (result.nModified!=0){
                
                res.send("edited");}
            else {
          res.send(" doesn't exist");
            }
          });
    });

router.route('/deleteinstructor').delete(async(req, res) => {
    try{
        var myId=req.headers.payload.id;
        var inputCourse=req.body.course;
        var inputInstructor=req.body.instructor;
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

router.route('/addTA').post( async(req, res) => {
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
    
router.route('/deleteTA').delete(async(req, res) => {
        try{
            var myId=req.headers.payload.id;
            var inputCourse=req.body.course;
            var inputInstructor=req.body.ta;
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
                return res.status(404).send("Request not found");
            }

        }else{
            return res.status(400).send("Please provide irequest id");

        }


    }catch(error){
        return res.status(500).send(error.message);
    }

});   

router.post('/rejectRequest',async(req,res)=>{
    try{
        var requestId=req.body.id;
        var rejectReason=req.body.reason;
        if(requestId){
            var acceptedRequest=await request.findOneAndUpdate({_id:requestId},{status:"Rejected",rejectionReason:rejectReason},{new:true});
            if(acceptedRequest){
                var academicMember=acceptedRequest.fromId;
                var notify=await notification.create({
                    requestID: requestId,
                    accepted: false,
                    to:academicMember
                });
                return res.status(200).send(acceptedRequest);
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
  


         









    



module.exports=router;