const Joi = require('joi');
module.exports= {
    sendReplacementRequest:Joi.object({
        replacementId:Joi.string().required(),
        courseId:Joi.string().required(),
        reqSlot:Joi.string().required(),
        reqDay:Joi.string().required(),
        reqLocation:Joi.string().required(),
        reqDate:Joi.date().required()
        },

    ),

    sendSlotLinkingRequest:Joi.object({
        courseId:Joi.string().required(),
        slotId:Joi.number().required()
        },
    ),

    sendChangeDayOffRequest:Joi.object({
        reqReason:Joi.string().required(),
        dayToChange:oi.number().required()
        },

    ),
    sendLeaveRequest:Joi.object({
        reqReason:Joi.string().required(),
        leaveType:Joi.string().required()
        },
    ),
}    