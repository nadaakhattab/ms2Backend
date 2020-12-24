const mongoose=require('mongoose');
const app=require('./app');
const cron = require('node-cron');
const staffMembers=require('./models/staffMember');
const iddb = require('./models/id');
const department = require('./models/department');
const course = require('./models/course');
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
console.log(ids);
    if(ids.length==0){
        console.log("da5al");
        const list=[
        "slot",
        "location",
        "faculty",
        "department",
        "course",
        "staff",
        "HR"];
        list.forEach(async(one)=>{
                if (one=="location"){
                location.create({displayName:"c7-101", room:"location-1", type:"office", maxCapacity:5, capacity:1});
                      await  iddb.create({name:one,count:1});
            }
            else{
                if(one=="HR"){
                   let password= "123456";
        const salt= await bcrypt.genSalt(10);
       password= await bcrypt.hash(password,salt);
              staffMembers.create({name:"HR#1",email:"HR1@guc.edu.eg", id:"hr-1", gender:"female",salary:20000, password, officeLocation:"location-1", type:"HR", mobileNumber:0120000});
                await  iddb.create({name:one,count:1});
            }else{
                  await  iddb.create({name:one,count:0});
            }
            }
          
        
         
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

