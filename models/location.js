const mongoose=require('mongoose');
const schema=mongoose.Schema;
const locationSchema=new schema({
room: String,
type: String, // lab, tut, lec, office
capacity: Number,
maxCapacity:Number

}
);
module.exports=mongoose.model('location',locationSchema)