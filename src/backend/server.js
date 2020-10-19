const express = require("express");

var bodyParser = require('body-parser');

var cors = require('cors')

const patient = require("./routes/patient.js");
const crf = require("./routes/crf.js");

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


// NeDB
const Datastore = require('nedb');

const db = {};
db.data = new Datastore({
  filename: 'db/data.db',
  autoload: true
});





// Routes
app.get("/", function(req, res) {
  res.send("Hello World!");
});

const route = express.Router();


app.use(route)
app.use('/', patient)
app.use('/', crf)



// Start Server
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
