const mongoose=require('mongoose');
const schema=mongoose.Schema;
const courseSchema=new schema({
displayName:{type:String, unique:true, required:true},
name: {type:String, unique:true, required:true},//Used as the NAME ID
coordinator: String, //Must be one of the TAs --> RESPRESENTS THE ID
instructors :[String], //ID
TAs: [String], //id
department: String,
faculty: String,
teachingSlots:Number
}
);
module.exports=mongoose.model('course',courseSchema)