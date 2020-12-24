const Joi = require('joi');

module.exports= {
    assignSlot:Joi.object({
    staffId:Joi.string().required(),
    courseName:Joi.string().required(),
    slotId:Joi.number().required(),
       
      },
   ),

    updateSlot:Joi.object({
    staffId:Joi.string().required(),
    courseName:Joi.string().required(),
    oldSlotId:Joi.number().required(),
    newSlotId:Joi.number().required(),

      
},
),

    assignCourseCoordinator:Joi.object({
    courseName:Joi.string().required(),
    id:Joi.string().required(),
       
      },
   ),

}
