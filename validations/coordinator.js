const Joi = require('joi');

module.exports= {
    addSlot:Joi.object({
    slot:Joi.string().required(),
    day:Joi.string().required(),
    location:Joi.string().required(),
    instructor: Joi.string()
       
      },
   ),

   replyRequest:Joi.object({
    slotId:Joi.number().required(),
    fromId:Joi.string().required(),
    status:Joi.string().required(),
      },
   ),

   EditSlot:Joi.object({
      id:Joi.number().required(),
      slot:Joi.string(),
      day:Joi.string(),
      location:Joi.string(),
      course: Joi.string(),
      instructor: Joi.string()

        },
     ),

}