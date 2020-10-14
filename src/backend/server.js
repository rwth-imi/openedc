const express = require("express");

var bodyParser = require('body-parser');
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.filename)
  }
})
const upload = multer({
    storage: storage
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  next()
})

app.get("/", function(req, res) {
  res.send("Hello World!");
});


const route = express.Router();
route.post("/api/upload/", upload.single("file"), (req, res, next) => {
    const absolutePath = path.join(__dirname, req.file.path);
    const jsonString = fs.readFileSync(absolutePath, "utf-8");
    const jsonObject = JSON.parse(jsonString);
    res.json(jsonObject)
});

app.use(route)

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
