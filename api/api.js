var express = require('express');

var app = express();

app.post('/register', function (req, res) {
  res.send("hi");
})

var server = app.listen(3000, function () {
  console.log('api is listening on ', server.address().port);
})