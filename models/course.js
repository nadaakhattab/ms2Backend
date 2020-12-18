const mongoose=require('mongoose');
const schema=mongoose.Schema;
const courseSchema=new schema({
name: String,
coordinator: String, //Must be one of the TAs
instructors :[String],
TAs: [String]
}
);
module.exports=mongoose.model('course',courseSchema)