const mongoose=require('mongoose');
const schema=mongoose.Schema;
const attendanceSchema=new schema({
id: {type:String,required:true},
date: String,
signIn: [Date],
signOut: [Date],
}
);
module.exports=mongoose.model('attendance',attendanceSchema)