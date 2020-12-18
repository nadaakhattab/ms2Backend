const mongoose=require('mongoose');
const schema=mongoose.Schema;
const attendanceSchema=new schema({
id: {type:String,required:true,unique:true},
date: Date,
attended: {type:Boolean, default:false},
signIn: [Date],
signOut: [Date],
requiredHours: Number,
hoursSpent:Number,
}
);
module.exports=mongoose.model('attendance',attendanceSchema)