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
replacement: String // id of the replacement person
}
);
module.exports=mongoose.model('request',requestSchema)