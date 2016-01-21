var express = require("express");
var app     = express();
var port    = process.env.PORT || 4000;

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(port);
