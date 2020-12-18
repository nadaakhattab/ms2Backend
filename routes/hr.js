const express = require('express')
const router = express.Router()
const location = require('../models/location');
const faculty = require('../models/faculty');
const staffMember= require('../models/staffMember');
const department = require('../models/department');

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




 router.route('/addStaffMember').post( (req, res) => {
staffMember.findOne({email:req.body.email}).then(result =>{
  if(result){
  res.send("Email already exists");
  }
  else{

location.findOne({...req.body.officeLocation}).then(result => {
if(result.fullCapacity){
res.send("Can't assign the following office Location");
}else {
  // req.body lazm yekon fyha  name, email, salary and office location.
  // ID???
  staffMember.create({...req.body}).then((result)=>{
res.send(result);
  });

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