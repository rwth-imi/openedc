const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const patient = require("./routes/patient.js");
const crf = require("./routes/crf.js");
const crfRecord = require("./routes/crf_record.js");

// Configuration of server
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// Header
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});
app.use(cors());

// Routes
app.get("/", function(req, res) {
  res.send("Hello World!");
});

// add outsourced routes
app.use("/api/data/", crfRecord);
app.use("/api/patient/", patient);
app.use("/api/crf/", crf);

// Start Server
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
