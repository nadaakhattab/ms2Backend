const mongoose=require('mongoose');
const schema=mongoose.Schema;
const notificationSchema=new schema({
requestID:String, // mongooseID for the requests
accepted: Boolean,
to: String,
removed:{type:Boolean,default:false},
}
);
module.exports=mongoose.model('notification',notificationSchema)