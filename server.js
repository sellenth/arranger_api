// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

// Server port
var HTTP_PORT = process.env.PORT || 8000 
// Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
  console.log("Try getting http://localhost:8000/api/arrangements")
});
// Root endpoint
app.get("/", (req, res, next) => {
  res.json({"message":"Ok"})
});

app.get("/api/arrangements", (req, res, next) => {
  if (req.query.uid != null) {
    var sql = "select * from arrangements where uid = ?";
    params = [parseInt(req.query.uid)];
  } else {
    var sql = "select * from arrangements"
    var params = []
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    for (var i = 0; i < rows.length; i++){
      rows[i].points = JSON.parse(rows[i].points);
    }
    res.json({
      "message":"success",
      "data":rows
    })
  });
});

app.post("/api/add_arrangement", (req, res, next) => {
  let uid = req.query.uid;
  let x_dim = req.query.x_dim;
  let y_dim = req.query.y_dim;
  let points = req.query.points;

  var insert = 'INSERT INTO arrangements (uid, x_dim, y_dim, points) VALUES (?,?,?,?)'
  db.run(insert, [uid,x_dim,y_dim,points])
  res.json({
    "message":"successfully added row to table",
  });
});

app.delete("/api/delete_arrangement", (req, res, next) => {
  let aid = req.query.aid;

  var delete_str = 'DELETE FROM arrangements WHERE aid = ?'
  db.run(delete_str, [aid]);
  res.json({
    "message":"successfully deleted row from table",
  });
});

// Default response for any other request
app.use(function(req, res){
  res.status(404);
});

