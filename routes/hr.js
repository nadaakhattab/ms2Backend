const express = require('express')
const router = express.Router()
const bcrypt=require('bcryptjs');
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');
const course = require('../models/course');
const idDb = require('../models/id');

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






module.exports = router;