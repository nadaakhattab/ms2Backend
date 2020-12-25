const Joi = require('joi');

module.exports= {
    addSlot:Joi.object({
    slot:Joi.string().required(),
    day:Joi.string().required(),
    location:Joi.string().required(),
    course: Joi.string().required(),
    instructor: Joi.string().required()
       
      },
   ),

   EditSlot:Joi.object({
      slot:Joi.string().required(),
      day:Joi.string().required(),
      location:Joi.string().required(),
      course: Joi.string().required(),
      instructor: Joi.string().required()
         
        },
     ),

   replyRequests:Joi.object({
    slotId:Joi.number().required(),
    fromId:Joi.string().required(),
    status:Joi.string().required(),
    toId:Joi.string().required(),
    type:Joi.string().required()
      },
   ),

}