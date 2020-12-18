const mongoose=require('mongoose');
const schema=mongoose.Schema;
const staffMemberSchema=new schema({
    //upon registration
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    id: String,
    name: String,
    salary: Number,
    faculty: String,
    department: String,
    attendanceSheet: Object,
    type: String,
    officeLocation: String,
    course:String // to academic staff only
}
);

module.exports=mongoose.model('staffMember',staffMemberSchema)
