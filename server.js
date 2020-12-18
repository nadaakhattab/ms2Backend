const mongoose=require('mongoose');
const app=require('./app');
const URL = "mongodb+srv://nada:1234@aclproject.lz3yx.mongodb.net/GUCPortal?retryWrites=true&w=majority";
global.accessKey="qfsgdbhcvkdlfgdfsdaksjaqfsvghbkshb";
global.refreshKey="wghdkjfhl;gjlkuiopo23yorpiotpyhgf";
global.refreshTokens=[];
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(URL,connectionParams).then(async()=>{
    console.log("Connected to db");
    app.listen(3000,function()
{
    console.log("Server started at port 3000");
});
}).catch((error)=>{
    console.log("Error connecting to db"+error);
}); 

app.listen()