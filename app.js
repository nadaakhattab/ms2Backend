const express = require('express');
const bodyParser = require('body-parser');
const hrRoutes = require('./routes/hr');
const staffMemberRoutes=require('./routes/staffMemberRoutes');
const verify= require('./routes/tokenverification');
const externalRoutes=require('./routes/externalRoutes');
const coordinatorRoutes=require('./routes/coordinator');
const academicMemberRoutes=require('./routes/academicMember');

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

function checkCC(req, res, next) {
      if (req.headers.payload.type=="CC"){
          console.log("CC Confirmed");
        return next();  
      }
      else {
          res.status(400).send("UnAuthorized: Not CC ");
      }
}

function checkAM(req, res, next) {
  if (req.headers.payload.type=="HOD"||
       req.headers.payload.type=="TA" ||
       req.headers.payload.type=="CI" ||
       req.headers.payload.type=="CC"){
      console.log("Academic Member Confirmed");
    return next();  
  }
  else {
      res.status(400).send("UnAuthorized: Not Academic Member ");
  }
}

app.use ("/hr",checkHr,hrRoutes);
app.use ("/coordinator",checkCC,coordinatorRoutes);
app.use("/academicMember",checkAM,academicMemberRoutes);
app.use("/staffMember",staffMemberRoutes);

module.exports=app;


