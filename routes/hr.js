const express = require('express')
const router = express.Router()
const bcrypt=require('bcryptjs');
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const idDb = require('../models/id');
const attendance = require('../models/attendance');

// Abl maykhosh to this route need a middlewear to verify that staff is hr 

router.route('/addLocation').post( (req, res) => {
location.findOne({room:req.body.room}).then(result =>{
  // error message
  if (result){res.send("already exists");}
  else {
location.create({room: req.body.room, type: req.body.type, capacity: req.body.capacity}).then(result => {
         res.send(result);
     });
  }
});
 });


 router.route('/editLocation').put((req, res) => {
location.updateOne({room:req.body.room},{$set:{...req.body}}).then(result =>{
  // error message
  console.log(result);
  if (result.nModified!=0){
      
      res.send("edited");}
  else {
res.send("Location doesn't exist");
  }
});
 });


router.route('/deleteLocation').delete((req, res) => {
 location.deleteOne({...req.body}).then(result => {
   res.send("location successfuly deleted");
 }).catch (err=>{
   res.send(err);
 })
 });



 router.route('/addFaculty').post((req, res) => {
faculty.findOne({name:req.body.name}).then(result =>{
  // error message
  if (result){res.send("already exists");}
  else {
faculty.create({...req.body}).then(result => {
         res.send(result);
     });
  }
});
 });


router.route('/editFaculty').put((req, res) => {
faculty.updateOne({name:req.body.name},{$set:{...req.body}}).then(result =>{
  // error message
  console.log(result);
  if (result.nModified!=0){
      
      res.send("edited");}
  else {
res.send("Location doesn't exist");
  }
});
 });

 router.route('/deleteFaculty').delete((req, res) => {
 faculty.deleteOne({...req.body}).then(result => {
   res.send("Faculty successfuly deleted");
 }).catch (err=>{
   res.send(err);
 })
 });

// under faculty 

 router.route('/addDepratment').post((req, res) => {
   //takes faculty name & department name
faculty.findOne({name:req.body.faculty}).then(result =>{
  console.log(result);
  if (result){
 const departments =result.departments;
 if(departments.includes(req.body.department)){
   // department already exists under this faculty 
   res.send("department already exists under this faculty");
 }
 else {   // update db with new department array
   departments.push(req.body.department); 
   faculty.updateOne({name:req.body.faculty},{$set:{departments}}).then (result => {
   console.log(result);
   res.send("added");
   }).catch (err =>{
     res.send("error");
   })

 }

  }
  else {
    // faculty doesn't exist
  }

}).catch (err => {
 res.send("error outsude");
})
 });


// router.route('/editDepartment').put((req, res) => {
// faculty.updateOne({name:req.body.name},{$set:{...req.body}}).then(result =>{
//   // error message
//   console.log(result);
//   if (result.nModified!=0){
      
//       res.send("edited");}
//   else {
// res.send("Location doesn't exist");
//   }
// });
//  });

 router.route('/deleteDepartment').delete((req, res) => {
faculty.findOne({name:req.body.faculty}).then(result =>{
  console.log(result);
  if (result){
 const departments =[];
 if(result.departments.includes(req.body.department)){
   result.departments.forEach(dept=> {
     if (dept!= req.body.department){
       departments.push(dept);
     }
     
   });
   faculty.updateOne({name:req.body.faculty},{$set:{departments}}).then (result => {
   console.log(result);
   res.send("Deleted successfully");
   }).catch (err =>{
     res.send("error");
   })

 }
 else { 
  res.send("department doesn't exist under this faculty");
 }

  }
  else {
    // faculty doesn't exist
  }

}).catch (err => {
 res.send("error outsude");
})
 });



 router.route('/addCourse').post((req, res) => {
  //takes department name & course name
department.findOne({name:req.body.department}).then(result =>{
  console.log(result);
  if (result){
 const courses =result.courses;
 if(courses.includes(req.body.course)){
   res.send("course already exists under this department");
 }
 else {   // update db with new courses array
   courses.push(req.body.course); 
   department.updateOne({name:req.body.department},{$set:{courses}}).then (result => {
   console.log(result);
   res.send("course added");
   }).catch (err =>{
     res.send("error");
   })

 }

  }
  else {
    // faculty doesn't exist
  }

}).catch (err => {
 res.send("error outsude");
})
 });


// router.route('/editCourse').put((req, res) => {
// faculty.updateOne({name:req.body.name},{$set:{...req.body}}).then(result =>{
//   // error message
//   console.log(result);
//   if (result.nModified!=0){
      
//       res.send("edited");}
//   else {
// res.send("Location doesn't exist");
//   }
// });
//  });

 router.route('/deleteCourse').delete((req, res) => {
   // display error law msh medyny department
department.findOne({name:req.body.department}).then(result =>{
  console.log(result);
  if (result){
 const courses =[];
 if(result.courses.includes(req.body.course)){
   result.courses.forEach(course=> {
     if (course!= req.body.course){
       courses.push(course);
     }
     
   });
   department.updateOne({name:req.body.department},{$set:{courses}}).then (result => {
   console.log(result);
   res.send("Deleted successfully");
   }).catch (err =>{
     res.send("error");
   })

 }
 else { 
  res.send("department doesn't exist under this faculty");
 }

  }
  else {
    // faculty doesn't exist
  }

}).catch (err => {
 res.send("error outsude");
})
 });

//extra
  router.route('/createCourse').post((req, res) => {
course.findOne({name:req.body.name}).then(result =>{
  // error message
  if (result){res.send("already exists");}
  else {
course.create({...req.body}).then(result => {
         res.send(result);
     });
  }
});
 });

//extra
   router.route('/createDepartment').post((req, res) => {
department.findOne({name:req.body.name}).then(result =>{
  // error message
  if (result){res.send("already exists");}
  else {
department.create({...req.body}).then(result => {
         res.send(result);
     });
  }
});
 });


 router.route('/addStaffMember').post( (req, res) => {
staffMember.findOne({email:req.body.email}).then(result =>{
  if(result){
  res.send("Email already exists");
  }
  else{

location.findOne({room:req.body.officeLocation}).then(result => {
  console.log(result);
  if (result){
    const locCapacity=result.capacity;
if(result.capacity== result.maxCapacity){
res.send("Can't assign the following office Location");
}else {
  // req.body lazm yekon fyha  name, email, salary and office location.
  let id= "";
  let dayoff= null;
  let idCount=null;
    idDb.findOne({name:req.body.type}).then(async (result)=>{
      if (result){
        if(req.body.type=="HR"){
      id=`hr-${result.count+1}`;
    dayoff="Saturday";}
    else{
      id=`as-${result.count+1}`;
    }
    idCount=result.count+1;
       let password= "123456";
      //   const salt= await bcrypt.genSalt(10);
      //  password= await bcrypt.hash(password,salt);
        console.log("password",password);
        const data = {
          password,
          id,
          name: req.body.name,
          email: req.body.email,
          salary: req.body.salary,
          officeLocation: req.body.officeLocation
        }
        if (dayoff){
          data.dayoff= dayoff;
        }
staffMember.create({...data}).then(result=>{

    idDb.updateOne({name:req.body.type},{$set:{count:idCount}}).then((result)=>{
location.updateOne({room:req.body.officeLocation},{$set:{capacity:locCapacity+1}}).then((result)=>{
      res.send(" created done");  });
    });

} ).catch (err =>{
  console.log(err);
  res.send("user Couldn't be created");
})

}
else {
  res.send("id doesn't exist");
} 
    });
}}
else {
res.send("location not found");
} });

}
});
 });



 router.route('/updateStaff').put((req, res) => {
  //  id:req.body.id
   staffMember.updateOne({email: req.body.email},{$set:{...req.body}}).then(result => {
     res.send(result);
   }).catch(err => {
     res.send(err);
   })

 });

 router.route('/attendanceRecord').get( (req, res) => {
   staffMember.findOne({...req.body}).then(result=>{
     res.send(result.attendanceSheet);

   })
 });


 router.route('/deleteStaff').delete((req, res) => {
   staffMember.deleteOne({...req.body}).then(result => {
   res.send("staff successfuly deleted");
 }).catch (err=>{
   res.send(err);
 })

 });


 router.route('/updateSalary').put((req, res) => {
  //  id:req.body.id
   staffMember.updateOne({email: req.body.email},{$set:{salary:req.body.salary}}).then(result => {
     res.send(result);

   }).catch(err => {
     res.send(err);
   })

 });

 router.get('/viewAttendance/:id',async(req,res)=>{
  try{
    var userId=req.params.id;
    var monthToView=req.body.month;
    var yearToView=req.body.year;
    if(!yearToView||!monthToView){
        return res.status(400).send("Please enter month and year") 

    }else{
        var monthDate=new Date(yearToView,monthToView,11);
        var nextMonthDate;
        if(monthToView==11){
            nextMonthDate=new Date(yearToView+1,0,10);   
        }else{
            nextMonthDate=new Date(yearToView,monthToView+1,10);
        }
        var records=await attendance.find({id: userId});
        var recordsToSend=records.filter(function(record){
            var date=new Date(Date.parse(record.date));
            return date>=monthDate && date<nextMonthDate
        })
        return res.status(200).send(recordsToSend);
    }
    }catch(error){
        return res.status(500).send(error.message);
    }
 });

 router.post('/signIn',async(req,res)=>{
  try{
    var userId=req.body.id;
    var datetime=req.body.date;
    if(!userId && !datetime){
      res.status(400).send("Please enter user id and date time")

    }else{
      var myId=req.headers.payload.id;
      if(userId!=myId){
        var curDate=new Date(datetime);
        var dateToday=curDate.toLocaleDateString();
        const record=await attendance.findOne({id: userId,date:dateToday});
        if(record){
            var signInArray=record.signIn;
            signInArray.push(curDate);
            signInArray.sort();
            var attendanceRecord=await attendance.findOneAndUpdate({id:userId,date:dateToday},{
                signIn: signInArray,
            },{new:true})
            return res.status(200).send(attendanceRecord);
        }else{
            var attendanceRecord=await attendance.create({
                id: userId,
                date: dateToday,
                signIn: [curDate],
                signOut: []
            });
            return res.status(200).send(attendanceRecord);
            
        }

      }else{
        res.status(404).send("Not authorized")
      }
      
    }


  }catch(error){
      return res.status(500).send(error.message);
  }

});

router.post('/signOut',async(req,res)=>{
  try{
    var userId=req.body.id;
    var datetime=req.body.date;
    if(!userId && !datetime){
      res.status(400).send("Please enter user id and date time")

    }else{
      var myId=req.headers.payload.id;
      if(userId!=myId){
        var curDate=new Date(datetime);
        var dateToday=curDate.toLocaleDateString();
        const record=await attendance.findOne({id: userId,date:dateToday});
        if(record){
          var signOutArray=record.signOut;
          signOutArray.push(curDate);
          signOutArray.sort();
          var attendanceRecord=await attendance.findOneAndUpdate({id:userId,date:dateToday},{
              signOut: signOutArray,
          },{new:true})
          return res.status(200).send(attendanceRecord);
      }else{
          var attendanceRecord=await attendance.create({
              id: userId,
              date: dateToday,
              signIn: [],
              signOut: [curDate],
          });
          return res.status(200).send(attendanceRecord);
          
      }

      }else{
        res.status(404).send("Not authorized")
      }
      
    }


  }catch(error){
      return res.status(500).send(error.message);
  }

});

router.post('/missingHours',async(req,res)=>{

  try{
    var monthToView=req.body.month;
    var yearToView=req.body.year;
    if(!monthToView||!yearToView){
        //start or end not provided in body
        return res.status(400).send("No dates provided");
    }else{
      var users=await staffMember.find();
      var startDate=new Date(yearToView,monthToView,11);
      var endDate;
      if(monthToView==11){
          endDate=new Date(yearToView+1,0,10);
      
      }else{
          endDate=new Date(yearToView,monthToView+1,10);
      }
      if(startDate<endDate){
        var usersToSend=[];
      for(var i=0;i<users.length;i++){
        var user=users[i];
        var userId=user.id;
        var allRecords=users.filter(function(record){
          return record.id==userId;
        })
        var records=allRecords.filter(function(record){
          var date=new Date(Date.parse(record.date));
          return date>=startDate && date<endDate
      })
  var requiredHours=0;
  var workedHours=0;    
  for(var i=0;i<records.length;i++){
    var day=new Date(Date.parse(records[i].date)).getDay();
    //console.log("Day"+day);
    if(day!=5 && day!=user.dayOffNumber){
        requiredHours+=8.24
    }
    var signIn=records[i].signIn;
    if(signIn.length>0){
        var minSignIn=signIn[0];
        var minSigninHours=minSignIn.getHours();
        console.log("Sign in hour"+minSigninHours);
        if(minSigninHours<7){ 
            //add sign at 7 before 7
            minSignIn.setHours(7,0,0);
        }
        //remove sign ins not between 7 and 7 
        signIn=signIn.filter(function(timeRecord){
            return timeRecord.getHours()>=7 && timeRecord.getHours()<19;
        }) 

    }
    var signOut=records[i].signOut;
    if(signOut.length>0){
        var maxSignOut=signOut[signOut.length-1];
        var maxSignOutHours=maxSignOut.getHours();
        console.log("Sign in hour"+maxSignOutHours);
        if(maxSignOutHours>15){
            //add sign out at 7
            maxSignOut.setHours(19,0,0);
            // signOut.push(maxSignOut);
        }
        
        //remove sign ins not between 7 and 7 
        signOut=signOut.filter(function(timeRecord){
            return timeRecord.getHours()>7 && timeRecord.getHours()<=19;
        }) 


    }
    for(var j=0;j<signOut.length&&signIn.length>0;j++){
        //console.log(signIn);
        var min=signIn[0];
        if(signOut[j]>min){
            signIn=signIn.filter(function(timeRecord){
                return timeRecord>min;
            })
            workedHours+=(signOut[j].getTime()-min.getTime())/(1000*3600);
        }
    }
} 
  var missingHours=requiredHours-workedHours;
  if(missingHours>0){
    usersToSend.push(user);

  }        
      }
    }else{
      return res.status(400).send("Invalid dates");
  }
  res.status(200).send(usersToSend);
      
    }

}catch(error){
    return res.status(500).send(error.message);
}

});

router.post('/missingDays',async(req,res)=>{
  try{
    var monthToView=req.body.month;
    var yearToView=req.body.year;
    if(!monthToView||!yearToView){
        //start or end not provided in body
        return res.status(400).send("No dates provided");
    }else{
      var users=await staffMember.find();
      var startDate=new Date(yearToView,monthToView,11);
      var endDate;
      if(monthToView==11){
          endDate=new Date(yearToView+1,0,10);
      
      }else{
          endDate=new Date(yearToView,monthToView+1,10);
      }
      if(startDate<endDate){
        var usersToSend=[];
      for(var i=0;i<users.length;i++){
        var user=users[i];
        var userId=user.id;
        var userLeaves=[];
        userLeaves=user.acceptedLeaves;
        var allRecords=users.filter(function(record){
          return record.id==userId;
        })
        var records=allRecords.filter(function(record){
          var date=new Date(Date.parse(record.date));
          return date>=startDate && date<endDate
      })
      var missingDays=[];   
                    var d=startDate;
                    while(d<=endDate){
                        //loop over days from start to end 
                       var day=d.getDay();
                       if(day!==5 && day!==user.dayOffNumber){
                           //not friday and not day off
                           if(!userLeaves.includes(d)){
                               //not a leave
                            var check= records.filter(function(record){
                                return record.date==d;
                            })
                            if(check<1){
                                //if no records found then add to missing 
                                missingDays.push(d);
                            }

                           }
                       }
                       d=new Date (d.setDate(d.getDate()+1));
                    } 
                    if(missingDays.length>0){
                      usersToSend.push(user);
                    }


      }
    }else{
      return res.status(400).send("Invalid dates");
  }
  res.status(200).send(usersToSend);
      
    }

}catch(error){
    return res.status(500).send(error.message);
}

});

module.exports = router;