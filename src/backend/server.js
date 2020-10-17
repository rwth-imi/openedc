const express = require("express");

var bodyParser = require('body-parser');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var cors = require('cors')

const patient = require("./routes/patient.js");

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
db.crfs = new Datastore({
  filename: 'db/crfs.db',
  autoload: true
});

// File Upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    cb(null, req.body.filename)
  }
})
const upload = multer({
  storage: storage
});



// Routes
app.get("/", function(req, res) {
  res.send("Hello World!");
});

const route = express.Router();
route.post("/api/upload/", upload.single("file"), (req, res, next) => {
  const absolutePath = path.join(__dirname, req.file.path);
  const jsonString = fs.readFileSync(absolutePath, "utf-8");
  const jsonObject = JSON.parse(jsonString);

  const crf = {
    crfName: jsonObject.name,
    crfLanguage: jsonObject.language,
    crfDescription: jsonObject.description,
  }

  db.crfs.insert(crf, function(err, inserted) {
    if (err) {
      console.log('error', err)
      res.json({
        success: false,
        error: err,
        payload: null
      });
    } else {
      res.json({
        success: true,
        error: false,
        payload: inserted
      });
    }
  })
});

app.use(route)
app.use('/', patient)



// Start Server
app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
