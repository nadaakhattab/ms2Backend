const mongoose=require('mongoose');
const schema=mongoose.Schema;
const courseSchema=new schema({
name: String, // unique
coordinator: String, //Must be one of the TAs --> RESPRESENTS THE ID
instructors :[String], //ID
TAs: [String], //id
department: String
}
);
module.exports=mongoose.model('course',courseSchema)