const mongoose=require('mongoose');
const schema=mongoose.Schema;
const locationSchema=new schema({
displayName: {type:String,unique:true},
room: {type:String,unique:true},
type: String, // lab, tut, lec, office
capacity: {type:Number, default:0},
maxCapacity:Number

}
);
module.exports=mongoose.model('location',locationSchema)