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
const { findOneAndUpdate } = require('../models/location');
const { response } = require('../app');
const { request } = require('express');

const validateBody =(req, res,next)  =>  { try{ 
  let result;
switch(req.path){
  case '/addLocation':result = validations.AddLocation.validate(req.body); 
  break;
   case '/editLocation':result = validations.EditLocation.validate(req.body); 
  break;
   case '/deleteLocation':result = validations.DeleteLocation.validate(req.body); 
  break;
  case '/addFaculty':result = validations.AddFaculty.validate(req.body); 
  break;
  case '/addDepartment':result = validations.AddDepartment.validate(req.body); 
  break;
  case '/editDepartment':result = validations.EditDepartment.validate(req.body); 
  break;
  case '/editCourse':result = validations.EditCourse.validate(req.body); 
  break;
  case '/editFaculty':result = validations.EditFaculty.validate(req.body); 
  break;
  case '/addCourse':result = validations.AddCourse.validate(req.body); 
  break;
  case '/signIn':result = validations.SignIn.validate(req.body); 
  break;
  case '/signOut':result = validations.SignOut.validate(req.body); 
  break;
  case '/addStaffMember':result = validations.AddStaffMember.validate(req.body); 
  break;
   case '/updateStaff':result = validations.UpdateStaff.validate(req.body); 
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
      location.create({room:`location-${newId}`,displayName: req.body.room, type: req.body.type, maxCapacity: req.body.maxCapacity}).then(result => {
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
res.status(501).send("Nothing to modify");
  }
});
 });


router.route('/deleteLocation/:room').delete((req, res) => {
     if(req.params.room==undefined){
    return  res.status(300).send("Undefined room");
   }
 location.deleteOne({room: req.params.room}).then(result => { 
    if(result.deletedCount==0){
    res.status(301).send("Location doesn't exist");
  }
staffMember.findOneAndUpdate({officeLocation:req.params.room},{$set:{officeLocation:null}}).then(()=>{
     res.status(200).send("location successfuly deleted");
});
 }).catch (err=>{
   res.status(500).send("Database Error");
 })
 });



 router.route('/addFaculty').post(validateBody,(req, res) => {
     if(req.body.displayName==undefined){
     res.status(301).send("Can't create a faculty without name");
   }
faculty.findOne({displayName:req.body.displayName}).then(result =>{
  // error message
  if (result){res.status(301).send("Faculty already exists");}
  else {

 idDb.findOne({name:"faculty"}).then(idSlot =>{
        newId= idSlot.count+1;
faculty.create({name:`faculty-${newId}`, displayName:req.body.displayName}).then(result => {
     idDb.updateOne({name:"faculty"},{$set:{count:newId}}).then(()=>{
          res.status(200).json({
           message:"Added Successfully",
           data:result});
     });
        })
    });


 
  }
}).catch(err=>{
  res.status(500).send("Database Error")
})
 });



router.route('/editFaculty').put(validateBody,(req, res) => {
  const toUpdate ={}
   if(req.body.displayName){
     toUpdate.displayName=req.body.displayName;
     
   }
   else {
     res.status(301).send("Can't update a faculty without name");
   }

   if(req.body.name==undefined){
     res.status(301).send("ERROR: NameId required");
   }

faculty.findOne({displayName:req.body.diaplyName}).then(fac=>{
  if(fac){
  res.status(301).send("Name already Exists");
   }
else{
   faculty.findOneAndUpdate({name:req.body.name},{...toUpdate}, {new:true}).then(result =>{
  // error message
  console.log(result);
  if (result){
      
      res.status(200).json({
           message:"edited Successfully",
           data:result});
      }
      else{
         res.status(301).send(" Faculty name doesn't exist");
      }
    
}).catch(err=>{
  console.log(err);
 res.status(301).send("Faculty doesn't exist");
})
}
});

 });



 router.route('/deleteFaculty/:name').delete((req, res) => {
   if(req.params.name== undefined){
     res.status(301).send("Can't delete Faculty. Please Add Faculty Name");
   }
 faculty.deleteOne({name:req.params.name}).then(result => {
department.deleteMany({faculty:req.params.name}).then (depts=>{
  course.deleteMany({faculty:req.params.name}).then (course =>{
academicMember.deleteMany({faculty:req.params.name}).then(()=>{
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
 router.route('/addDepartment').post(validateBody,(req, res) => {
   if(req.body.faculty==undefined || req.body.department==undefined){
    return res.status(301).send("Please add All required Fields");
   }
   //takes faculty name & department name & all department details
faculty.findOne({name:req.body.faculty}).then( result =>{
  console.log(result);
  if (result){
    department.findOne({displayName: req.body.department}).then(dept => {
      console.log("DEPT",dept);
    if(dept){
      console.log("already exists");
      return res.status(300).send("Department Name Already Exists");
    }
    else {
       const departments =result.departments?result.departments:[];
//  if(departments.includes(req.body.department)){
//    // department already exists under this faculty 
//    res.status(301).send("department already exists under this faculty");
//  }
//  else {   // update db with new department array
  
      //  department.findOne({name: req.body.department}).then(dept => {
      //    if (dept){ 
      //      if(dept.faculty!== req.body.faculty){
      //      res.status(300).send("Department Already exists under a different Faculty");
      //    }else {
      //         res.status(200).send("Successfully Added under Faculty");
      //    }
      //   }
      //    else {
         

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
 departments.push(`department-${newId}`); 
  department.create({name:`department-${newId}`,displayName: req.body.department,...toAdd}).then(newDept=>{
        faculty.updateOne({name:req.body.faculty},{$set:{departments}}).then (result => {
     idDb.updateOne({name:"department"},{$set:{count:newId}}).then(()=>{
      return res.status(200).json({
           message:"Added Successfully",
           data:newDept});
     });

        });
        }).catch(err =>{
     res.status(500).send("department Name already exists");
   })
    });

    }).catch (err =>{
     res.status(500).send("HOD/ COURSES Doesn't exist");
   });

    }
      
    });



     
 }

  }).catch (err => {
 res.status(500).send("Database Error");
})
 });


 function updatCourse(courseIN, faculty){
    return new Promise((resolve, reject) => {
      course.findOneAndUpdate({name:courseIN},{$set:{faculty:faculty}},{new:true}).then((resul)=>{
        console.log(result);
resolve();
      }).catch((err)=>{
        reject();
      })
    });

 }

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


router.route('/editDepartment').put(validateBody,(req, res) => {
  const toUpdate={};
  const arrayofPromises=[];
  if(req.body.displayName){
    toUpdate.displayName=req.body.displayName;
  }
  if(req.body.faculty){
toUpdate.faculty=req.body.faculty;
  arrayofPromises.push(checkFaculty(req.body.department,req.body.faculty));
  department.findOne({name:req.body.department}).then((dep)=>{
dep.courses.forEach((course)=>{
  arrayofPromises.push(updatCourse(course, req.body.faculty));
})
  
  })

  }

console.log(req.body.HOD);
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
 router.route('/deleteDepartment/:faculty/:department').delete((req, res) => {
   if(req.params.faculty==undefined||req.params.department==undefined){
     res.status(301).send("Can't Delete Department without specifying the department & Faculty");
   }
faculty.findOne({name:req.params.faculty}).then(result =>{
  console.log(result);
  if (result){
 const departments =[];
 if(result.departments.includes(req.params.department)){
   result.departments.forEach(dept=> {
     if (dept!= req.params.department){
       departments.push(dept);
     }
     
   });
   faculty.updateOne({name:req.params.faculty},{$set:{departments}}).then (result => {
     department.deleteOne({name:req.params.department}).then(deletedDept =>{
       if(deletedDept){
       console.log("dep",deletedDept);
course.deleteMany({department:req.params.department}).then(courses=>{
  academicMember.deleteMany({department:req.params.department}).then(()=>{
res.status(200).send("Deleted successfully");
  });
});}
else {
  res.status(300).send("department doesn't exist");
}
   
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



 router.route('/addCourse').post(validateBody,(req, res) => {
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

   // update db with new courses array
  //  courses.push(req.body.course); 
   department.findOne({name:req.body.department}).then (result => {
     console.log("Deaprtment res: ",result);
let newId;
 idDb.findOne({name:"course"}).then(idSlot =>{
        newId= idSlot.count+1;
        const toupdate= {displayName:req.body.course, department:req.body.department, faculty:result.faculty};
        if (req.body.teachingSlots){
          toupdate.teachingSlots= req.body.teachingSlots;
        }
        console.log(toupdate);
      return    course.create({name:`course-${newId}`,...toupdate}).then(courseNew =>{
   res.status(200).send(courseNew);
    }).catch((err)=>{
      console.log(err);
      res.status(300).send("Can't create course, a similar one exists")
    })

    }).then(()=>{
        idDb.updateOne({name:"course"},{$set:{count:newId}}).then(()=>{
           if(courses.includes(`course-${newId}`)){
   res.status(300).send("course already exists under this department");
 }
 else{ courses.push(`course-${newId}`);
            department.findOneAndUpdate({name:req.body.department},{$set:{courses}},{new:true}).then (result => {
            res.status(200).send("Successfully created");
             }).catch (err =>{
     res.status(300).send("course not added in Department");
   });}
        })
    });

 

   }).catch (err =>{
     res.status(300).send("course not added in Department");
   })



  }
  else {
res.status(300).send("Department Doesn't exist");
  }

}).catch (err => {
 res.status(500).send("Database Error");
})
});


 });




function checkdep (dept,cour,newDep){
  return new Promise((resolve, reject) => {
    console.log(dept);
    department.findOne({name:dept}).then(currDep=>{
      console.log("CURDEP",currDep);
      //Get current Faculty that this department is assigned to
      if(currDep){
        const listOfCo= [];
        currDep.courses.forEach((course)=>{
          if(course!=cour){
            listOfCo.push(course);
          }

        });
        //removes department from this faculty
department.findOneAndUpdate({name:dept},{$set:{courses:listOfCo}}).then(result =>{
  console.log("NEW DEP",newDep);
    department.findOne({name:newDep}).then(newDepag=>{
      //Get current Faculty that this department is assigned to
      if(newDepag){
        console.log(newDepag);
        const listOfCon= newDepag.courses;
        listOfCon.push(cour);
department.findOneAndUpdate({name:newDep},{$set:{courses:listOfCon}}).then(fin =>{
  resolve();


});
}
else {
        reject();
      }

    }).catch(err =>{
      reject();
    })



});

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








router.route('/editCourse').put(validateBody,(req, res) => {
  // law hay update el department lazm aroh ashylo from old department & add in new department IMPORTANT
  if(req.body.course==undefined){
     res.status(301).send("Can't Add a course without specifying its Name");
   }
   const promises=[];
   const toUpdate={};
   if(req.body.displayName){
     toUpdate.displayName=req.body.displayName;
   }

        if (req.body.teachingSlots){
          toUpdate.teachingSlots= req.body.teachingSlots;
        }
course.findOne({name:req.body.course}).then((co)=>{
   if(req.body.department!==undefined){
    promises.push( checkdep (co.department,req.body.course,req.body.department));
    }


    Promise.all(promises).then((fi)=>{
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
    }).catch(err=>{
      res.status(300).send("Error")
    })

}).catch((err)=>{
  res.status(500).send("Course Doesnt exist");
})
  

});

 router.route('/deleteCourse/:course').delete((req, res) => {
   // display error law msh medyny department

   course.findOne({name:req.params.course}).then(courseFound =>{
     if(!courseFound ){
 res.status(301).send("Course Doesn't Exist");
     }
     
department.findOne({name:courseFound.department}).then(result =>{
  console.log(result);
  if (result){
 const courses =[];
 if(result.courses.includes(req.params.course)){
   result.courses.forEach(course=> {
     if (course!= req.params.course){
       courses.push(course);
     }
     
   });
   department.updateOne({name:courseFound.department},{$set:{courses}}).then (result => {
          course.deleteOne({name:req.params.course}).then(deletedCourse =>{
 academicMember.deleteMany({course:req.params.course},{faculty:result.faculty, department:result.department}).then(()=>{
  res.status(200).send("Deleted successfully");
  });
 
     })
   }).catch (err =>{
     res.status(500).send("Database Error");
   })

 }
 else { 
  // res.status(300).send("Error:course no longer exists under its this department");
          course.deleteOne({name:req.params.course}).then(deletedCourse =>{
 academicMember.deleteMany({course:req.params.course},{faculty:result.faculty, department:result.department}).then(()=>{
  res.status(200).send("Deleted successfully");
  });
 
     })
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


 router.route('/addStaffMember').post(validateBody, (req, res) => {
staffMember.findOne({email:req.body.email}).then(result =>{
  if(result){
  res.status(300).send("Email already exists");
  }
  else{

location.findOne({room:req.body.officeLocation}).then(result => {
  console.log(result);
  if (result){
    const locCapacity=result.capacity;
if(result.capacity== result.maxCapacity){
res.status(300).send("Can't assign the following office Location");
}else {
  // req.body lazm yekon fyha  name, email, salary and office location.
  let id= "";
  let dayoff= null;
  let idCount=null;
  let n;
  if(req.body.type=="HR"){
n="HR"
  }
  else {
    n="staff"

  }
    idDb.findOne({name:n}).then(async (result)=>{
      if (result){
        if(n=="HR"){
      id=`hr-${result.count+1}`;
    dayoff="Saturday";}
    else{
      id=`as-${result.count+1}`;
    }
    idCount=result.count+1;
       let password= "123456";
        const salt= await bcrypt.genSalt(10);
       password= await bcrypt.hash(password,salt);
        console.log("password",password);
       let dayyOffNumber;
       switch (req.body.dayOff){
         case 'Sunday': dayyOffNumber=0; break;
          case 'Monday': dayyOffNumber=1; break;
          case 'Teusday': dayyOffNumber=2; break;
            case 'Wednesday': dayyOffNumber=3; break;
             case 'Thursday': dayyOffNumber=4; break;
              case 'Friday': dayyOffNumber=5; break;
               case 'Saturday': dayyOffNumber=6; break;
       }
        const data = {
          password,
          id,
          name: req.body.name,
          email: req.body.email,
          salary: req.body.salary,
          officeLocation: req.body.officeLocation,
          gender:req.body.gender,
          type:req.body.type

        }
        if(req.body.type!=="HR"){
          data.dayOff=req.body.dayOff;
          data.dayOffNumber=dayyOffNumber;
        }
staffMember.create({...data}).then(result=>{

    idDb.updateOne({name:n},{$set:{count:idCount}}).then((result)=>{
location.updateOne({room:req.body.officeLocation},{$set:{capacity:locCapacity+1}}).then((result)=>{
  if(req.body.type=="HOD"){
if(req.body.department){
 department.findOneAndUpdate({name:req.body.department},{$set:{HOD:id}}).then ((depart)=>{

academicMember.create({id:id, department:req.body.department, faculty:depart.faculty}).then (()=>{
res.status(200).send("Successfully added");
});
    });
}
else {
  res.status(200).send("Successfully added");
}
   

  }
  else{
      res.status(200).send(" created done");
  }
      });
    });

} ).catch (err =>{
  console.log(err);
  res.status(300).send("user Couldn't be created");
})

}
else {
  res.status(300).send("id doesn't exist");
} 
    });
}}
else {
res.status(300).send("location not found");
} });

}
});
 });





function upLoc(loc,newLoc){
  return new Promise((resolve, reject) => {
  location.findOne({room:loc}).then(result => {
    console.log("OLD:",result);
       if(result){
       return  location.findOneAndUpdate({room:loc},{$set:{capacity:result.capacity-1}});
       }
       else{ return }
      
     }).then (()=>{
         location.findOne({room:newLoc}).then(result => {
           console.log(result);
       if(result){
      location.findOneAndUpdate({room:newLoc},{$set:{capacity:result.capacity+1}}).then(()=>{
        resolve();
      })
       }
       else{reject();}
      
      
     });

     })
    })};


 router.route('/updateStaff').put(validateBody,(req, res) => {
staffMember.findOne({id:req.body.id}).then((mem)=>{
  if(!mem){
    return res.status(300).send("Staff member doesnt exist");
  }
  else{  
     const toUpdate={};
     const arrayofPromises=[];
       if(req.body.officeLocation){
       arrayofPromises.push(  upLoc(mem.officeLocation,req.body.officeLocation));
         toUpdate.officeLocation=req.body.officeLocation;
   }
  

// });  
   if(req.body.dayOff){
 let dayyOffNumber;
       switch (req.body.dayOff){
         case 'Sunday': dayyOffNumber=0; break;
          case 'Monday': dayyOffNumber=1; break;
          case 'Teusday': dayyOffNumber=2; break;
            case 'Wednesday': dayyOffNumber=3; break;
             case 'Thursday': dayyOffNumber=4; break;
              case 'Friday': dayyOffNumber=5; break;
               case 'Saturday': dayyOffNumber=6; break; 
       } toUpdate.dayOffNumber= dayyOffNumber;
   }
 
console.log("TO UP",toUpdate);       
Promise.all(arrayofPromises).then(()=>{
   staffMember.findOneAndUpdate({id: req.body.id},{$set:{...req.body,...toUpdate}},{new:true}).then(result => {
     console.log(result);
     res.status(200).send(result);
   }).catch(err => {
     res.status(300).send(err);
   });
}).catch((err)=>{
  res.status(300).send("ERROR: please check that the location exists")
})



  }
  

 });});

//  router.route('/attendanceRecord/:id').get( (req, res) => {
  
//    staffMember.findOne({id:req.params.id}).then(result=>{
//     if(req.params.id==undefined){
//       return  res.status(300).send("Undefined ID");
//      }
//      if(result){
// attendance.find({id:req.params.id}).then((att)=>{

//   let filteredRecords=att.filter(function(inputRecord){
//     if(inputRecord.signOut){
//         if(inputRecord.signOut.length>0){
//             if(inputRecord.signIn){
//                 if(inputRecord.signIn.length>0){
//                     if(inputRecord.signIn[0]<inputRecord.signOut[0]){
//                         return inputRecord;
//                     }

//                 }
//             }
//         }
//     }

// });
// res.status(200).send(filteredRecords);
// })
//      }
//      else {
//        res.status(300).send("Member doesnt exist");
//      }
    

//    })
//  });


 router.route('/deleteStaff/:id').delete(async (req, res) => {
   if(req.params.id==undefined){
     res.status(300).send("Error: Please add required paramters");
   }
   const result =await staffMember.findOne({id:req.params.id});
console.log(req.params.id);
console.log(result,"FARAH");
   if(result){
     const listofAllCourse= await academicMember.find({id:req.params.id});
      if(result.type=="HR"){ 
staffMember.deleteOne({id:req.params.id}).then((result)=>{
    res.status(200).send("successfully deleted");
  });
      }
     if(result.type=="HOD"){
       academicMember.findOne({id:req.params.id}).then((acMme)=>{
         if(acMme){
           department.findOneAndUpdate({name:acMme.department},{$set:{HOD:null}},{new:true}).then((dep)=>{
           console.log(dep);
   academicMember.deleteOne({id:req.params.id}).then(()=>{
 staffMember.deleteOne({id:req.params.id}).then((result)=>{
    res.status(200).send("successfully deleted");
  })});
         })
         }
         else {
    academicMember.deleteOne({id:req.params.id}).then(()=>{
 staffMember.deleteOne({id:req.params.id}).then((result)=>{
    res.status(200).send("successfully deleted");
  })});
         }
         
  

       });
    
     }
     else{
if (listofAllCourse){
  console.log(listofAllCourse);
// get each course --> loop on its ta/ instructor/ coordinator if ==req.para.id remove it
listofAllCourse.forEach(async(mem)=>{
 let coursen;
 coursen= await course.findOne({name:mem.course});
 if(coursen){
   let InstDel;
   let  cDel;
const arrayofPromises=[cDel, InstDel];
const courseTas= [];

 cDel= new Promise((resolve, reject) => {
    coursen.TAs.forEach((ta, index, array) => {
        if(ta!==req.params.id){
 courseTas.push(ta);
  }
        if (index === array.length -1) resolve();
    });
});

const courseInst= [];

InstDel= new Promise((resolve, reject) => {
   coursen.instructors.forEach((inst, index, array) => {
     if(inst!==req.params.id){
    courseInst.push(inst);
  }
        if (index === array.length -1) resolve();
    });
});

const coord= null;
if(coursen.coordinator!==req.params.id){
coord= coursen.coordinator;
}


Promise.all(arrayofPromises).then (()=>{
  const toUpdate={TAs:courseTas,
instructors: courseInst,
coordinator:coord};
console.log(toUpdate);
console.log(mem.course);
course.findOneAndUpdate({name:mem.course},{$set:{...toUpdate}},{new:true}).then ((updated)=>{
  academicMember.deleteOne({id:req.params.id}).then(()=>{
 staffMember.deleteOne({id:req.params.id}).then((result)=>{
    res.status(200).send("successfully deleted");
  })})
});
}).catch((err)=>{
    res.status(300).send("Error occured");
})

  }
});
}
else{
  academicMember.deleteOne({id:req.params.id}).then(()=>{
 staffMember.deleteOne({id:req.params.id}).then((result)=>{
    res.status(200).send("successfully deleted");
  })})
}
   }
   }
   else{
     res.status(300).send("staff member doesn't exist");
   }
});


 router.route('/updateSalary').put((req, res) => {
   staffMember.findOneAndUpdate({id: req.body.id},{$set:{salary:req.body.salary}},{new:true}).then(result => {
     res.status(200).send(result);

   }).catch(err => {
     res.status(300).send(err);
   })

 });

 router.get('/viewAttendance/:id/:yearToView/:monthToView',async(req,res)=>{
  try{
    var userId=req.params.id;
    if(req.params.id==undefined){
      return  res.status(300).send("Undefined ID");
     }
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
    // if(!yearToView||!monthToView){
    //     return res.status(400).send("Please enter month and year") 

    // }else{
      if(monthToView<=11){
        var monthDate=new Date(yearToView,monthToView,11);
        var nextMonthDate;
        if(monthToView==11){
            nextMonthDate=new Date(yearToView+1,0,10);   
        }else{
            nextMonthDate=new Date(yearToView,monthToView+1,10);
        }
        var curDate=new Date();
        var dateToday = new Date(curDate.setHours(0,0,0));
        if(dateToday<nextMonthDate){
          console.log("here");
          console.log(curDate);
            nextMonthDate=dateToday;
        }
        var records=await attendance.find({id: userId});
        console.log(records);
        var recordsToSend=records.filter(function(record){
        
            var date=new Date(Date.parse(record.date));  
            console.log(monthDate,date,  nextMonthDate);
            return date>=monthDate && date<nextMonthDate
        })
        let filteredRecords=recordsToSend.filter(function(inputRecord){
          if(inputRecord.signOut){
              if(inputRecord.signOut.length>0){
                  if(inputRecord.signIn){
                      if(inputRecord.signIn.length>0){
                          if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                              return inputRecord;
                          }
      
                      }
                  }
              }
          }
      
      });
        return res.status(200).send(filteredRecords);

      }else{
        return res.status(400).send("Please enter month between 1 and 12")
      }

    // }
    }catch(error){
        return res.status(500).send(error.message);
    }
 });

 router.post('/signIn',validateBody,async(req,res)=>{
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

router.post('/signOut',validateBody,async(req,res)=>{
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
    // if(monthToView==null ||monthToView==undefined ||!yearToView){
    //   console.log(monthToView,yearToView);
    //     //start or end not provided in body
    //     console.log("F");
    //     return res.status(400).send("No dates provided");
    // }else{
      if(monthToView<=11){
        var users=await staffMember.find({});
        var startDate=new Date(yearToView,monthToView,11);
        var endDate;
        if(monthToView==11){
            endDate=new Date(yearToView+1,0,10);
        
        }else{
            endDate=new Date(yearToView,monthToView+1,10);
        }
        var curDate=new Date();
        var dateToday = new Date(curDate.setHours(0,0,0));
        if(dateToday<endDate){
            endDate=dateToday;
        }
        if(startDate<endDate){
          var usersToSend=[];
          var allUserRecords=await attendance.find({});
          // console.log(allUserRecords);
          // console.log(users.length);
        for(var i=0;i<users.length;i++){
          var user=users[i];
          var userId=user.id;
          var allRecords=allUserRecords.filter(function(record){
            return record.id==userId;
          })
          var records=allRecords.filter(function(record){
            var date=new Date(Date.parse(record.date));
            return date>=startDate && date<endDate
        })
        records=records.filter(function(inputRecord){
          if(inputRecord.signOut){
              if(inputRecord.signOut.length>0){
                  if(inputRecord.signIn){
                      if(inputRecord.signIn.length>0){
                          if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                              return inputRecord;
                          }
  
                      }
                  }
              }
          }
  
      });
      // console.log("REC "+records);
    var requiredHours=0;
    var workedHours=0;    
    for(var k=0;k<records.length;k++){
      var day=new Date(Date.parse(records[k].date)).getDay();
      //console.log("Day"+day);
      if(day!=5 && day!=user.dayOffNumber){
        console.log("here");
          requiredHours+=8.24
      }
      var signIn=records[k].signIn;
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
      var signOut=records[k].signOut;
      if(signOut.length>0){
          var maxSignOut=signOut[signOut.length-1];
          var maxSignOutHours=maxSignOut.getHours();
          console.log("Sign in hour"+maxSignOutHours);
          if(maxSignOutHours>19){
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
      user.missingHours=missingHours;
      usersToSend.push({...user,missingHours});
  
    }  
  console.log("HEREE");      
        }
        
        return res.status(200).send(usersToSend);
      }else{
         console.log("FA");
        return res.status(400).send("Invalid dates");
    }
    

      }else{
         console.log("FAAA");
        return res.status(400).send("Please enter month between 1 and 12")

      }

      
    // }

}catch(error){
    return res.status(500).send(error.message);
}

});

router.get('/missingDays/:yearToView/:monthToView',async(req,res)=>{
  try{
    var monthToView=parseInt(req.params.monthToView-1);
    var yearToView=parseInt(req.params.yearToView);
    // if(!monthToView||!yearToView){
    //   console.log("LINE 1415");
    //     //start or end not provided in body
    //     return res.status(400).send("No dates provided");
    // }else{
      if(monthToView<=11){
        var users=await staffMember.find({});
        var startDate=new Date(yearToView,monthToView,11);
        var endDate;
        if(monthToView==11){
            endDate=new Date(yearToView+1,0,10);
        
        }else{
            endDate=new Date(yearToView,monthToView+1,10);
        }
        var curDate=new Date();
        var dateToday = new Date(curDate.setHours(0,0,0));
        if(dateToday<endDate){
            endDate=dateToday;
        }
        console.log(startDate,endDate);
        if(startDate<endDate){
          var usersToSend=[];
          var allUserRecords=await attendance.find({});
        for(var i=0;i<users.length;i++){
          var user=users[i];
          var userId=user.id;
          
          var allRecords=allUserRecords.filter(function(record){
            return record.id==userId;
          })
          var records=allRecords.filter(function(record){
            var date=new Date(Date.parse(record.date));
            return date>=startDate && date<endDate
        })
        records=records.filter(function(inputRecord){
          if(inputRecord.signOut){
              if(inputRecord.signOut.length>0){
                  if(inputRecord.signIn){
                      if(inputRecord.signIn.length>0){
                          if(inputRecord.signIn[0]<inputRecord.signOut[inputRecord.signOut.length-1]){
                              return inputRecord;
                          }
  
                      }
                  }
              }
          }
  
      });
        var missingDays=[];   
                      var d=startDate;
                      while(d<=endDate){
                          //loop over days from start to end 
                         var day=d.getDay();
                         if(day!==5 && day!==user.dayOffNumber){
                           let check=[];
                           check=records.filter(function(record){
                             return d.getTime()==new Date(record.date).getTime();
                           })
                           if(check.length>0){
                             console.log("here")
                           }else{
                           var leaves= await requests.find({fromId:userId,type:"leave",
                          leaveStartDate:{$lte:d},leaveEndDate:{$gte:d},status:"Accepted"});
                          if(leaves){
                            if(!(leaves.length>0)){
                              missingDays.push(new Date(d));
                              
  
                            }
                          }else{
                            missingDays.push(new Date(d));
  
                          }
                             
                           }
                         }
                         d=new Date (d.setDate(d.getDate()+1));
                      } 
                      if(missingDays.length>0){
                        user.missingDays=missingDays.length;
                        usersToSend.push({...user,missingDays:missingDays.length});
                      }
        }
      }else{  console.log("LINE 1498");
        return res.status(400).send("Invalid dates");
      
    }
    return res.status(200).send(usersToSend);

      }else{
        console.log("LINE 1502");
        return res.status(400).send("Please enter month between 1 and 12")
      }

      
    // }

}catch(error){
    return res.status(500).send(error.message);
}

});

module.exports = router;