const mongoose=require('mongoose');
const schema=mongoose.Schema;
const locationSchema=new schema({
  room: String,
  type: String, // lab, tut, lec, office
capacity: Number,
fullCapacity: { type: Boolean, default: false },

}
);
module.exports=mongoose.model('location',locationSchema)