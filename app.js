const express = require('express');
const bodyParser = require('body-parser');
const hrRoutes = require('./routes/hr');
const staffMemberRoutes=require('./routes/staffMemberRoutes');
const app = express();

app.use(bodyParser.json());
app.use ("/hr",hrRoutes);
app.use("/staffMember",staffMemberRoutes);

module.exports=app;


