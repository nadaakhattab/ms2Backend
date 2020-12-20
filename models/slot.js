const mongoose=require('mongoose');
const schema=mongoose.Schema;
const slotSchema=new schema({
id:{type:Number,required:true,unique:true},
course: String, 
day: String,
slot: String, //slot number
instructor: String ,// id of instructor
location: String
}
);
module.exports=mongoose.model('slot',slotSchema);