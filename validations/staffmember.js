const Joi = require('joi');

module.exports= {
    UpdateProfile:Joi.object({
       
        mobileNumber:Joi.number(),
        email:Joi.string()
       
      },
   ),

   ChangePassword:Joi.object({
       email:Joi.string().required(),
    password:Joi.string().required() ,
    oldPassword:Joi.string().required(),
  },
),







}
