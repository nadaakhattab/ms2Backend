const mongoose=require('mongoose');
const schema=mongoose.Schema;
const facultySchema=new schema({
displayName:{type:String, unique:true, required:true},
name: {type:String,unique:true,required:true},
departments: [String],
}
);
module.exports=mongoose.model('faculty',facultySchema)