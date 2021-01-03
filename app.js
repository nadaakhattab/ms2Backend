const express = require('express');
const bodyParser = require('body-parser');
const hrRoutes = require('./routes/hr');
const staffMemberRoutes=require('./routes/staffMemberRoutes');
const verify= require('./routes/tokenverification');
const externalRoutes=require('./routes/externalRoutes');
const coordinatorRoutes=require('./routes/coordinator');
const academicMemberRoutes=require('./routes/academicMember');
const hodRoutes=require('./routes/hod');
const ciRoutes=require('./routes/ci');
const frontEndHOD=require('./frontEndRoutes/feHod');
var cors = require('cors');

const app = express();
app.use(cors());
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

function checkHOD(req,res,next){
  if(req.headers.payload.type=="HOD"){
      console.log("HOD Confirmed");
      return next();}
      else{
          res.status(400).send("UnAuthorized: Not Head of Department")
      }
  }

  function checkCI(req,res,next){
      if(req.headers.payload.type=="CI"){
          console.log("CI Confirmed");
          return next();}
          else{
              res.status(400).send("UnAuthorized: Not a Course Instructor")
          }
      }

app.use ("/hr",checkHr,hrRoutes);
app.use ("/coordinator",checkCC,coordinatorRoutes);
app.use("/academicMember",checkAM,academicMemberRoutes);
app.use("/hod",checkHOD, hodRoutes);
app.use("/ci",checkCI,ciRoutes)
app.use("/staffMember",staffMemberRoutes);
app.use('/feHod', frontEndHOD);
module.exports=app;


