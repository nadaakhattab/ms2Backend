const Joi = require('joi');

module.exports= {
  AddLocation:Joi.object({
      room: Joi.string()
        .required(),
      type: Joi.string().required(),
      maxCapacity:Joi.number().required(),
      capacity:Joi.number(),
     
    },
 ),
   EditLocation:Joi.object({
      room: Joi.string()
        .required(),
      type: Joi.string(),
      maxCapacity:Joi.number(),
       capacity:Joi.number(),
       displayName:Joi.string()
    },
 ),
//     DeleteLocation:Joi.object({
//       room: Joi.string()
//         .required(),
//       type: Joi.string(),
//       maxCapacity:Joi.number(),
//        capacity:Joi.number()
//     },
//  ),

 AddFaculty:Joi.object({
  displayName: Joi.string()
    .required(),  
},
),

EditFaculty:Joi.object({
  displayName: Joi.string()
    .required(),
    name: Joi.string()
    .required(),
},
),

AddDepartment:Joi.object({
  department: Joi.string()
    .required(),
    faculty: Joi.string()
    .required(),
    HOD:Joi.string()
    
  
},
),

EditDepartment:Joi.object({
  displayName: Joi.string()
    ,
    faculty: Joi.string()
    ,
    HOD:Joi.string(),
    department:Joi.string().required()
  
},
),

AddCourse:Joi.object({
  course: Joi.string()
    .required(),
  department: Joi.string()
    .required(),
    teachingSlots:Joi.required()
    
    
  
},
),

EditCourse:Joi.object({
  displayName: Joi.string()
    ,
  course: Joi.string()
    .required(),
  department: Joi.string()
   ,
  teachingSlots:Joi.number(),
  faculty:Joi.string().required()
    
    
    
  
},
),

AddStaffMember:Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string().required(),
  officeLocation: Joi.string().required(),
  department: Joi.string(),
  salary:Joi.number(),
  gender: Joi.string().required(),
  dayOff:Joi.string()

 
},
),

SignIn:Joi.object({
  id: Joi.string().required(),
  date: Joi.required(),
},
),

SignOut:Joi.object({
  id: Joi.string().required(),
  date: Joi.required(),
},
),

UpdateStaff:Joi.object({
  id: Joi.string().required(),
 dayOff:Joi.string(),
name:Joi.string(),
email:Joi.string(),
officeLocation: Joi.string(),
mobileNumber: Joi.string(),
type: Joi.string(),
salary: Joi.number(),
gender: Joi.string(),
annualLeaves: Joi.number()

},
),


}
