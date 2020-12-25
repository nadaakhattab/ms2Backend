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
    .required(),
    faculty: Joi.string()
    .required(),
    HOD:Joi.string(),
    department:Joi.string()
  
},
),

AddCourse:Joi.object({
  course: Joi.string()
    .required(),
  department: Joi.string()
    .required()
    
    
    
  
},
),

EditCourse:Joi.object({
  displayName: Joi.string()
    ,
  course: Joi.string()
    .required(),
  department: Joi.string()
    .required()
    
    
    
  
},
),

AddStaffMember:Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  email: Joi.string().required(),
  officeLocation: Joi.string().required(),
  department: Joi.string(),
  salary:Joi.number(),
  gender: Joi.string().required,
  dayOff:Joi.string()

 
},
),

SignIn:Joi.object({
  id: Joi.number().required(),
  date: Joi.date().required(),
},
),

SignOut:Joi.object({
  id: Joi.number().required(),
  date: Joi.date().required(),
},
),


}
