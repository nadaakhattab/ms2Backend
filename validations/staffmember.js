const Joi = require('joi');

module.exports= {
    UpdateProfile:Joi.object({
       
        mobileNumber:Joi.number(),
        email:Joi.string()
       
      },
   ),

   ChangePassword:Joi.object({
       
    password:Joi.string()
   
  },
),







}
