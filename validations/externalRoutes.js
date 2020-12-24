const Joi = require('joi');
module.exports= {
    Login:Joi.object({
        email:Joi.string().required(),
        password:Joi.string().required()
       
      },
   ),
   ResetPassword:Joi.object({
    email:Joi.string().required(),
    
  },
),
}