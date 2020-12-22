const mongoose=require('mongoose');
const schema=mongoose.Schema;
const staffMemberSchema=new schema({
    //upon registration
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    id:{type:String,required:true,unique:true},
    name: {type:String,required:true},
    salary: {type:Number,required:true},
    officeLocation: {type:String,required:true},
    type: {type:String,required:true},
    mobileNumber: String,
    dayOff: String,
    dayOffNumber:{type:Number,  required:true},
    firstLogin: {type:Boolean,default:true},
    annualLeaves:{type:Number,default:0},
    gender:String
}
);

module.exports=mongoose.model('staffMember',staffMemberSchema)
