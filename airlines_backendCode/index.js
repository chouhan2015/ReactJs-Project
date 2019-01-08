var express = require("express");
const bodyParser = require("body-parser");
var app = express();
var cors = require("cors");
var router = require("./src/routes/route");

app.use(cors({ allowedHeaders: "Content-Type, Cache-Control" }));
app.use("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError)
    return res.status(400).send(
      JSON.stringify({
        error: "Invalid JSON"
      })
    );
  console.error(err);
  res.status(500).send();
});
// app.get("/", function(req, res) {
//   loginController.login(req, res);
// });

var server = app.listen(8090, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
