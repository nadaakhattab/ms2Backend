const express = require('express');
const bodyParser = require('body-parser');
const hrRoutes = require('./routes/hr');
const staffMemberRoutes=require('./routes/staffMemberRoutes');
const verify= require('./routes/tokenverification');
const externalRoutes=require('./routes/externalRoutes');
const app = express();
app.use(bodyParser.json());
app.use('', externalRoutes);
app.use(verify);

function checkHr(req, res, next) {
      if (req.headers.payload.type=="HR"){
          console.log("HR Confirmed");
        return next();  
      }
      else {
          res.status(400).send("UnAuthorized: Not HR Member");
      }
}
app.use ("/hr",checkHr,hrRoutes);
app.use("/staffMember",staffMemberRoutes);

module.exports=app;


