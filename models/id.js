const mongoose=require('mongoose');
const schema=mongoose.Schema;
const idSchema=new schema({
name: String,
count:Number
}
);
module.exports=mongoose.model('id',idSchema)