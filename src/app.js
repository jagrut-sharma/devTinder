const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

// creates a server:
const app = express();
app.use(express.json());

//Request handlers:
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong - 1");
  }
});

app.get("/getUserData", (req, res, next) => {
  // try {
  // fetching user data from DB
  throw new Error("Some error occured");
  res.send("User Data sent");
  // }
  //  catch (error) {
  //   console.log(error);
  // }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong - 2");
  }
});

// listening on port 3000
app.listen(3000, () => {
  console.log("Listening on 3000");
});
