const Joi = require('joi');

module.exports= {
  AddLocation:Joi.object({
      room: Joi.string()
        .required(),
      type: Joi.string().required(),
      maxCapacity:Joi.number().required(),
      capacity:Joi.number()
    },
 ),
   EditLocation:Joi.object({
      room: Joi.string()
        .required(),
      type: Joi.string(),
      maxCapacity:Joi.number(),
       capacity:Joi.number()
    },
 ),
    DeleteLocation:Joi.object({
      room: Joi.string()
        .required(),
      type: Joi.string(),
      maxCapacity:Joi.number(),
       capacity:Joi.number()
    },
 ),


}
