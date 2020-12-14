const mongoose=require('mongoose');
const schema=mongoose.Schema;
const staffMemberSchema=new schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    id: Number,
    name: String,
    salary: Number,
    faculty: String,
    department: String,
    attendanceSheet: Object,
    type: String
}
);
module.exports=mongoose.model('staffMember',staffMemberSchema)
