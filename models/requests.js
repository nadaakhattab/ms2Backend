const { string } = require('joi');
const mongoose=require('mongoose');
const schema=mongoose.Schema;
const requestSchema=new schema({
fromId:{type:String,required:true},
toId:{type:String,required:true},
type:{type:String,required:true},
status: {type:String, default:"Pending"},
reason:{type:String},
leaveType:{type:String},
date:{type:Date,required:true},
leaveEndDate:{type:Date},
leaveStartDate:{type:Date},
course: {type:String},
day: {type:String},
slot: {type:String},
location: {type:String},
slotId: {type:Number},
documents: {type:Object},
replacement: {type:String}, // id of the replacement person
replacementDate:{type:Date},
dayToChange: {type:Number},
rejectionReason:{type:String}
}
);
module.exports=mongoose.model('request',requestSchema)