const express = require("express");

var bodyParser = require('body-parser');

var cors = require('cors')

const patient = require("./routes/patient.js");
const crf = require("./routes/crf.js");
const crf_data = require("./routes/crf_record.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// Header
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  next()
})
app.use(cors())


// Routes
app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.use('/', crf_data)
app.use('/', patient)
app.use('/', crf)




// Start Server
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
