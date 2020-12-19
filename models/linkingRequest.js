const mongoose=require('mongoose');
const schema=mongoose.Schema;
const linkingRequestSchema=new schema({
id:{type:Number,required:true,unique:true},
course: String,
day: String,
slot: String,
instructor: String,
accepted: {type:Boolean, default:false}
}
);
module.exports=mongoose.model('linkingRequest',linkingRequestSchema)