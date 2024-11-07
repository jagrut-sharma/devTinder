const express = require("express");

// creates a server:
const app = express();

//Request handlers:
app.get("/", (req, res) => {
  res.send("Namaste Jagrut");
});

app.get("/fun", (req, res) => {
  res.send("Having fun from server");
});

app.get("/test", (req, res) => {
  res.send("Hello from the servers");
});

// listening on port 3000
app.listen(3000, () => {
  console.log("Listening on 3000");
});
