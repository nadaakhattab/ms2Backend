const mongoose=require('mongoose');
const schema=mongoose.Schema;
const courseSchema=new schema({
name: {type:String, unique:true, required:true},
coordinator: String, //Must be one of the TAs --> RESPRESENTS THE ID
instructors :[String], //ID
TAs: [String], //id
department: String,
faculty: String
}
);
module.exports=mongoose.model('course',courseSchema)