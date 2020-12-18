const mongoose=require('mongoose');
const schema=mongoose.Schema;
const facultySchema=new schema({
name: String,
departments: [String],
}
);
module.exports=mongoose.model('faculty',facultySchema)