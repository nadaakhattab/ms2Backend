const Joi = require('joi');
module.exports= {
    sendReplacementRequest:Joi.object({
        id:Joi.string().required(),
        course:Joi.string().required(),
        slot:Joi.number().required(),
        // day:Joi.string().required(),
        // location:Joi.string().required(),
        date:Joi.date().required()
        },

    ),

    sendSlotLinkingRequest:Joi.object({
        course:Joi.string().required(),
        slot:Joi.number().required()
        },
    ),

    sendChangeDayOffRequest:Joi.object({
        reason:Joi.string(),
        day:Joi.string().required()
        },

    ),
    sendLeaveRequest:Joi.object({
        reason:Joi.string(),
        leave:Joi.string().required(),
        startDate:Joi.required(),
        endDate:Joi.required(),
        documents:Joi.string(),
        id:Joi.string(),
        toId: Joi.string(),
        },
    ),
    ReplyRequest:Joi.object({
        id:Joi.string().required(),
        status:Joi.string().required(),

    })
}    