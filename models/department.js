const mongoose=require('mongoose');
const schema=mongoose.Schema;
const departmentSchema=new schema({
displayName:{type:String, unique:true, required:true},
name: {type:String, unique:true, required:true},
courses :[String],
HOD: String,
faculty: String,
}
);
module.exports=mongoose.model('department',departmentSchema)