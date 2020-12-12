const express = require('express');
const hrRoutes = require('./routes/hr');

const app = express();
app.use(express.json());

app.use ("/hr",hrRoutes);


 // port Number
app.listen(3000);



