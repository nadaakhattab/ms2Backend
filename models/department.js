const mongoose=require('mongoose');
const schema=mongoose.Schema;
const departmentSchema=new schema({
name: String,
courses :[String],
HOD: String
}
);
module.exports=mongoose.model('department',departmentSchema)