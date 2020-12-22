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
const requests=require('../models/requests');
const academicMember = require('../models/academicMember');
const validations = require('../validations/hr');
const Joi = require('joi');

const validateBody =(req, res,next)  =>  { try{ 
  let result;
switch(req.path){
  case '/addLocation':result = validations.AddLocation.validate(req.body); 
  break;
   case '/editLocation':result = validations.EditLocation.validate(req.body); 
  break;
   case '/deleteLocation':result = validations.DeleteLocation.validate(req.body); 
  break;

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




router.route('/addLocation').post(validateBody,(req, res,next) => {
location.findOne({displayName:req.body.room}).then(result =>{
  if (result){ return res.status(501).send("Location Already exists");}
  else {
  idDb.findOne({name:"location"}).then(idSlot =>{
        newId= idSlot.count+1;
      location.create({room:newId,displayName: req.body.room, type: req.body.type, capacity: req.body.capacity}).then(result => {
       return  res.status(200).send("Successfully Added");
     });

    }).then(()=>{
        idDb.updateOne({name:"location"},{$set:{count:newId}}).then(()=>{
            res.status(200).send("Successfully created");
        })
    });


  }
});
} );


 router.route('/editLocation').put(validateBody,(req, res) => {
   const toUpdate ={}
   if(req.body.type){
     toUpdate.type=req.body.type;
   }
   if(req.body.maxCapacity){
     toUpdate.maxCapacity= req.body.maxCapacity;
   }
      if(req.body.capacity){
     toUpdate.capacity= req.body.capacity;
   }

      if(req.body.displayName){
     toUpdate.displayName= req.body.displayName;
   }
location.updateOne({room:req.body.room},{$set:{...toUpdate}}).then(result =>{
  // error message
  console.log(result);
  if (result.nModified!=0){
      
      res.status(200).send("Success: edited");}
  else {
res.status(501).send("Location doesn't exist");
  }
});
 });


router.route('/deleteLocation').delete((req, res) => {
 location.deleteOne({room: req.body.room}).then(result => {
  if(result.deletedCount==0){
    res.status(301).send("Location doesn't exist");
  }
   res.status(200).send("location successfuly deleted");
 }).catch (err=>{
   res.status(500).send("Database Error");
 })
 });



 router.route('/addFaculty').post((req, res) => {
     if(req.body.name==undefined){
     res.status(301).send("Can't create a faculty without name");
   }
faculty.findOne({name:req.body.name}).then(result =>{
  // error message
  if (result){res.status(301).send("Faculty already exists");}
  else {

 idDb.findOne({name:"faculty"}).then(idSlot =>{
        newId= idSlot.count+1;
faculty.create({name:newId, displayName:req.body.name}).then(result => {
         res.status(200).json({
           message:"Added Successfully",
           data:result});
     });

    }).then(()=>{
        idDb.updateOne({name:"faculty"},{$set:{count:newId}}).then(()=>{
            res.status(200).send("Successfully created");
        })
    });


 
  }
}).catch(err=>{
  res.status(500).send("Database Error")
})
 });



router.route('/editFaculty').put((req, res) => {
  const toUpdate ={}
   if(req.body.displayName){
     toUpdate.name=req.body.displayName;
     
   }
   else {
     res.status(301).send("Can't update a faculty without name");
   }

   if(req.body.name==undefined){
     res.status(301).send("ERROR: NameId required");
   }

faculty.findOne({name:req.body.name}).then(fac=>{
  if(fac){
  res.status(301).send("Name already Exists");
   }

   faculty.findOneAndUpdate({name:req.body.name},{...toUpdate}, {new:true}).then(result =>{
  // error message
  console.log(result);
  if (result){
      
      res.status(200).json({
           message:"edited Successfully",
           data:result});
      }
  
}).catch(err=>{
  console.log(err);
 res.status(301).send("Faculty doesn't exist");
})
  
});

 });



 router.route('/deleteFaculty').delete((req, res) => {
   if(req.body.name== undefined){
     res.status(301).send("Can't delete Faculty. Please Add Faculty Name");
   }
 faculty.deleteOne({name:req.body.name}).then(result => {
department.deleteMany({faculty:req.body.name}).then (depts=>{
  course.deleteMany({faculty:req.body.name}).then (course =>{
academicMember.deleteMany({faculty:req.body.name}).then(()=>{
   res.status(200).send("Faculty successfuly deleted");
});
  });
  
});

 }).catch (err=>{
   res.status(500).send("Database Error");
 });

 });


// under faculty 

function checkCourse(coursen,res){
  return new Promise((resolve, reject) => {
      course.findOne({name:coursen}).then(courseNew=>{
        console.log("Course",courseNew);
           if(!courseNew){
            reject( 
              // res.status(301).send("Course doesn't exist")
              );
           }
           else {
             resolve();
           }
         });
  });
}

function checkHOD(HOD,department,faculty,course){
  return new Promise((resolve, reject) => {
 staffMember.findOne({id:HOD, type:"HOD"}).then(hod=>{
    if(!hod){
      reject();
        // res.status(301).send("HOD Is not a staffMember"));
     }
     else{
       console.log("Hena",faculty);
       academicMember.findOne({id:HOD,department:department}).then((member)=>{
if(!member){
 academicMember.create({id:HOD,faculty:faculty,department:department,course:course}).then(()=>{
         resolve();}
       )
}
resolve();
       })
      
       
     }
    
  });
  });
}
 router.route('/addDepartment').post((req, res) => {
   if(req.body.faculty==undefined || req.body.department==undefined){
     res.status(301).send("Please add All required Fields");
   }
   //takes faculty name & department name & all department details
faculty.findOne({name:req.body.faculty}).then( result =>{
  console.log(result);
  if (result){
 const departments =result.departments!==null?result.departments:[];
 if(departments.includes(req.body.department)){
   // department already exists under this faculty 
   res.status(301).send("department already exists under this faculty");
 }
 else {   // update db with new department array
   departments.push(req.body.department); 
       department.findOne({name: req.body.department}).then(dept => {
         if (dept){ 
           if(dept.faculty!== req.body.faculty){
           res.status(300).send("Department Already exists under a different Faculty");
         }else {
              res.status(200).send("Successfully Added under Faculty");
         }}
         else {
         
console.log("department added under Faculty");
const arrayofPromises=[];
const toAdd= {faculty:req.body.faculty};
if(req.body.HOD){
  toAdd.HOD=req.body.HOD;
  console.log(req.body);
arrayofPromises.push(checkHOD(req.body.HOD,req.body.department,req.body.faculty));
}


  //  if(req.body.courses){
  // req.body.courses.forEach((course)=>{
  //      arrayofPromises.push(checkCourse(course,res));
  
  //      });
  //      toAdd.courses=req.body.courses;
  //     }


    // The new department must be created
   Promise.all(arrayofPromises).then(()=>{ 
     
  idDb.findOne({name:"department"}).then(idSlot =>{
        newId= idSlot.count+1;


      return   department.create({name:newId,displayName: req.body.department,...toAdd}).then(newDept=>{
        faculty.updateOne({name:req.body.faculty},{$set:{departments}}).then (result => {
      res.status(200).send("Successfully created");
        });
    });

    }).then(()=>{
        idDb.updateOne({name:"department"},{$set:{count:newId}}).then(()=>{
            res.status(200).send("Successfully created");
        })
    });
    

  
   }).catch (err =>{
     res.status(500).send("HOD/ COURSES Doesn't exist");
   });


     
 }

  });}}
  else {
    res.status(300).send("Faculty doesn't exist");
  }

}).catch (err => {
 res.status(500).send("Database Error");
})
 });

function checkFaculty (dept,fac){
  return new Promise((resolve, reject) => {
    console.log(dept);
    department.findOne({name:dept}).then(currDep=>{
      console.log("CURDEP",currDep);
      //Get current Faculty that this department is assigned to
      if(currDep){
        //removes department from this faculty
faculty.findOne({name:currDep.faculty}).then(result =>{
  console.log("INSIDE CHECK fAC" ,result);
  if (result){
 let departments =[];
 if(result.departments.includes(dept)){
   result.departments.forEach(deptm=> {
     if (deptm!= dept){
       departments.push(deptm);
     }
     
   });
   faculty.updateOne({name:currDep.faculty},{$set:{departments}}).then (result => {
     console.log("removed from old faculty");
//Add department to new Faculty
    faculty.findOne({name:fac}).then(resultNew =>{
const newdeps= resultNew.departments!==null?resultNew.departments:[];
newdeps.push(dept);
console.log(newdeps);

faculty.updateOne({name:fac},{$set:{departments:newdeps}}).then(()=>{
  academicMember.updateMany({department:dept},{faculty:fac}).then(()=>{
    resolve();
  });

});
   }).catch (err =>{
     reject();
   })

 });}
 else {
   // Old faculty doesn't include department 
   // so
   //Add department to new Faculty
   console.log("Faculty Name ",fac);
    faculty.findOne({name:fac}).then(resultNew =>{
const newdeps= resultNew.departments!==null?resultNew.departments:[];
newdeps.push(dept);
console.log(newdeps);

faculty.updateOne({name:fac},{$set:{departments:newdeps}}).then(()=>{
resolve();
});
   }).catch (err =>{
     reject();
   })
 }
}else {

}});

      }
      else {
        //department doesn't Exist
        reject();
      }

    }).catch(err =>{
      reject();
    })
  });


}


router.route('/editDepartment').put((req, res) => {
  const toUpdate={};
  const arrayofPromises=[];
  if(req.body.displayName){
    toUpdate.displayName=req.body.displayName;
  }
  if(req.body.faculty){
toUpdate.faculty=req.body.faculty;
  arrayofPromises.push(checkFaculty(req.body.department,req.body.faculty));
  }


    // check if HOD 
    if(req.body.HOD){
     arrayofPromises.push(checkHOD(req.body.HOD,req.body.department,req.body.faculty)); 
     toUpdate.HOD=req.body.HOD;
    }
    // check if Courses
    // if(req.body.courses){
    //     req.body.courses.forEach((course)=>{
         
    //    arrayofPromises.push(checkCourse(course,res));
  
    //    });
    //    toUpdate.courses=req.body.courses;
    // }
  
Promise.all(arrayofPromises).then(()=>{

  department.updateOne({name:req.body.department},{$set:{...toUpdate}}).then(deletedDept =>{

   res.status(200).send("updated Successfully");
     });}).catch(()=>{
       res.status(300).send("Canot be updated please check that HOD/COURSES/Faculty exists")
     })

 });


 //must take faculty name as input and department name
 router.route('/deleteDepartment').delete((req, res) => {
   if(req.body.faculty==undefined||req.body.department==undefined){
     res.status(301).send("Can't Delete Department without specifying the department & Faculty");
   }
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
     department.deleteOne({name:req.body.department}).then(deletedDept =>{
course.deleteMany({department:req.body.department}).then(courses=>{
  academicMember.deleteMany({department:req.body.department}).then(()=>{
res.status(200).send("Deleted successfully");
  })
})
   
     })

   }).catch (err =>{
     res.status(500).send("Database Error");
   })

 }
 else { 
  res.status(300).send("department doesn't exist under this faculty");
 }

  }
  else {
res.status(300).send("Faculty doesn't exist ");
  }

}).catch (err => {
 res.status(500).send("Database Error");
})
 });



 router.route('/addCourse').post((req, res) => {
  //takes department name & course name
  const toAdd={};
  if(req.body.department==undefined||req.body.course==undefined){
     res.status(301).send("Can't Add a course without specifying the department & Name");
   }

course.findOne({name:req.body.course}).then((co)=>{
  if(co){
    res.status(301).send(" course Already exists");
  }
department.findOne({name:req.body.department}).then(result =>{
  if (result){
 const courses =result.courses;
 if(courses.includes(req.body.course)){
   res.status(300).send("course already exists under this department");
 }
 else {   // update db with new courses array
   courses.push(req.body.course); 
   department.findOneAndUpdate({name:req.body.department},{$set:{courses}},{new:true}).then (result => {
     console.log("Deaprtment res: ",result);

 idDb.findOne({name:"course"}).then(idSlot =>{
        newId= idSlot.count+1;
      return    course.create({name:newId,displayName:req.body.course, department:req.body.department, faculty:result.faculty}).then(courseNew =>{
   res.status(200).send("course added");
    });

    }).then(()=>{
        idDb.updateOne({name:"course"},{$set:{count:newId}}).then(()=>{
            res.status(200).send("Successfully created");
        })
    });

 

   }).catch (err =>{
     res.status(300).send("course not added in Department");
   })

 }

  }
  else {
res.status(300).send("Department Doesn't exist");
  }

}).catch (err => {
 res.status(500).send("Database Error");
})
});


 });


router.route('/editCourse').put((req, res) => {
  // law hay update el department lazm aroh ashylo from old department & add in new department IMPORTANT
  if(req.body.course==undefined){
     res.status(301).send("Can't Add a course without specifying its Name");
   }
   const toUpdate={};
   if(req.body.displayName){
     toUpdate.displayName=req.body.displayName;

   }
   if(req.body.department!==undefined){
     department.findOne({name:req.body.department}).then (departmentres =>{
       if(departmentres){
course.findOneAndUpdate({name:req.body.course},{$set:{department:req.body.department,faculty:departmentres.faculty,...toUpdate}},{new:true}).then(result =>{
  console.log(result);
 academicMember.updateMany({course:req.body.course},{faculty:result.faculty, department:result.department}).then(()=>{
 res.status(200).send("success");
  });
 }).catch(()=>{
  

 });
}
       else {
res.status(300).send("Department doesn't exist");
  }



}).catch(err=>{
       res.status(500).send("Database Error");
})
     }
       else {
res.status(300).send("Department doesn't exist");
  }

});

 router.route('/deleteCourse').delete((req, res) => {
   // display error law msh medyny department

   course.findOne({name:req.body.course}).then(courseFound =>{
     if(!courseFound ){
 res.status(301).send("Course Doesn't Exist");
     }
     
department.findOne({name:courseFound.department}).then(result =>{
  console.log(result);
  if (result){
 const courses =[];
 if(result.courses.includes(req.body.course)){
   result.courses.forEach(course=> {
     if (course!= req.body.course){
       courses.push(course);
     }
     
   });
   department.updateOne({name:courseFound.department},{$set:{courses}}).then (result => {
          course.deleteOne({name:req.body.course}).then(deletedCourse =>{
 academicMember.deleteMany({course:req.body.course},{faculty:result.faculty, department:result.department}).then(()=>{
  res.status(200).send("Deleted successfully");
  });
 
     })
   }).catch (err =>{
     res.status(500).send("Database Error");
   })

 }
 else { 
  res.status(300).send("course doesn't exist under this department");
 }

  }
  else {
   res.status(300).send("Course doesn't Exist");
  }

}).catch (err => {
 res.status(500).send("Database Error");
})


   }).catch (err=>{
 res.status(500).send("Database Error");
   });







 });

// //extra
//   router.route('/createCourse').post((req, res) => {
// course.findOne({name:req.body.name}).then(result =>{
//   // error message
//   if (result){res.send("already exists");}
//   else {
// course.create({...req.body}).then(result => {
//          res.send(result);
//      });
//   }
// });
//  });

// //extra
//    router.route('/createDepartment').post((req, res) => {
// department.findOne({name:req.body.name}).then(result =>{
//   // error message
//   if (result){res.send("already exists");}
//   else {
// department.create({...req.body}).then(result => {
//          res.send(result);
//      });
//   }
// });
//  });


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

 router.get('/viewAttendance/:id/:yearToView/:monthToView',async(req,res)=>{
  try{
    var userId=req.params.id;
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
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

router.get('/missingHours/:yearToView/:monthToView',async(req,res)=>{

  try{
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
    if(!monthToView||!yearToView){
        //start or end not provided in body
        return res.status(400).send("No dates provided");
    }else{
      var users=await staffMember.find({});
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

router.get('/missingDays/:yearToView/:monthToView',async(req,res)=>{
  try{
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
    if(!monthToView||!yearToView){
        //start or end not provided in body
        return res.status(400).send("No dates provided");
    }else{
      var users=await staffMember.find({});
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
      var missingDays=[];   
                    var d=startDate;
                    while(d<=endDate){
                        //loop over days from start to end 
                       var day=d.getDay();
                       if(day!==5 && day!==user.dayOffNumber){
                        var leaves= await requests.find({fromId:userId,type:"leave",
                        leaveStartDate:{$lte:d},leaveEndDate:{$gte:d},status:"Accepted"});
                        if(!leaves){
                          if(leaves.length>0){
                            var check= records.filter(function(record){
                              return record.date==d;
                          })
                          if(check<1){
                              //if no records found then add to missing 
                              missingDays.push(d);
                          }

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