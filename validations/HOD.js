const Joi = require('joi');

module.exports= {
    addInstructor:Joi.object({
    course: Joi.string().required(),
    instructor: Joi.string().required()
       
      },
   ),

    updateInstructor:Joi.object({
    instructor:Joi.string().required(),
    course: Joi.string().required(),
    // newCourse:Joi.string().required(),

   
  },
),

    addTA:Joi.object({
    course: Joi.string().required(),
    ta: Joi.string().required(),
  
},
), 

    acceptRequest:Joi.object({
    id: Joi.string().required(),
    
},
),

    rejectRequest:Joi.object({
    id: Joi.string().required(),
    reason: Joi.string(),
},
),

}