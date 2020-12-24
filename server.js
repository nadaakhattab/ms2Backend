const mongoose=require('mongoose');
const app=require('./app');
const cron = require('node-cron');
const staffMembers=require('./models/staffMember');
const iddb = require('./models/id');
const department = require('./models/department');
const course = require('./models/course');
const hr = require('./validations/hr');
const URL = "mongodb+srv://nada:1234@aclproject.lz3yx.mongodb.net/GUCPortal?retryWrites=true&w=majority";
global.accessKey="qfsgdbhcvkdlfgdfsdaksjaqfsvghbkshb";
global.refreshKey="wghdkjfhl;gjlkuiopo23yorpiotpyhgf";
global.refreshTokens=[];
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true ,
    useFindAndModify: false 
}
mongoose.connect(URL,connectionParams).then(async()=>{
    console.log("Connected to db");
try{
const ids= await iddb.find({});
    if(!ids){
        const list=[
        "slot",
        "location",
        "faculty",
        "department",
        "course",
        "staff",
        "HR"];
        list.forEach(async(one)=>{
          await  iddb.create({name:one,count:0}); 
        })         
    }


    cron.schedule('0 0 11 * *', async function() {
        console.log('---------------------');
        console.log('Running Cron Job');
        var staff=await staffMembers.find({});
        if(staff){
            staff.forEach(async function(member){
                console.log(member);
                var updated=await staffMembers.findOneAndUpdate({id:member.id},{annualLeaves:member.annualLeaves+2.5},{new:true});
                console.log(updated);
            });
        }
      });   
}catch(error){

    console.log("Error"+error);

}


    app.listen(3000,function()
{

    console.log("Server started at port 3000");
});
}).catch((error)=>{
    console.log("Error connecting to db"+error);
}); 

app.listen();

