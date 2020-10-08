const express = require("express");
const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  next()
})

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.post("/api/upload/", (req, res, next) => {

  res.json({ 'test': 'success'})
});
app.get("/api/upload/", function(req, res) {
  res.send("Hello Upload!");
})

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
