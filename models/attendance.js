const mongoose=require('mongoose');
const schema=mongoose.Schema;
const attendanceSchema=new schema({
id: String,
date: Date,
attended: {type:Boolean, default:false},
signIn: [String],
signOut: [String],
requiredHours: Number,
hoursSpent:Number,
}
);
module.exports=mongoose.model('attendance',attendanceSchema)