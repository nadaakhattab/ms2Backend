const express = require('express');
const bodyParser = require('body-parser');
const hrRoutes = require('./routes/hr');
const staffMemberRoutes=require('./routes/staffMemberRoutes');
const verify= require('./routes/tokenverification');
const externalRoutes=require('./routes/externalRoutes');
const app = express();
app.use(bodyParser.json());
app.use('', externalRoutes);
app.use ("/hr",hrRoutes);
// app.use(verify);

app.use("/staffMember",staffMemberRoutes);

module.exports=app;


