const mongoose=require('mongoose');
const schema=mongoose.Schema;
const academicMemberSchema=new schema({
    id:{type:String,required:true},
    faculty:{type:String,required:true},
    department:{type:String,required:true},
    course:{type:String},
}
);
module.exports=mongoose.model('academicMember',academicMemberSchema);