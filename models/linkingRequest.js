const mongoose=require('mongoose');
const schema=mongoose.Schema;
const linkingRequestSchema=new schema({
slotId:{type:Number,required:true,unique:true},
accepted: {type:Boolean, default:false},
instructor: String
}
);
module.exports=mongoose.model('linkingRequest',linkingRequestSchema)