const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

// creates a server:
const app = express();
app.use(express.json());

//Request handlers:
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  //logic to fetch data
  res.send("User data sent");
});

app.delete("/admin/deleteUserData", (req, res) => {
  // finding the user to delete
  res.send("User deleted");
});

app.post("/user/login", (req, res) => {
  // Checking the user login details
  res.send("User logged in successfully");
});

app.get("/user/data", userAuth, (req, res) => {
  // fetch user data
  res.send("User data sent");
});

// listening on port 3000
app.listen(3000, () => {
  console.log("Listening on 3000");
});
