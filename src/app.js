const express = require("express");

// creates a server:
const app = express();
app.use(express.json());

//Request handlers:
app.use(
  "/user",
  [
    (req, res, next) => {
      console.log("Handling user 1");
      // res.send("1st response!!");
      // req.sampleVariable = "Hello hi namaste";
      next();
    },
    (req, res, next) => {
      console.log("Handling user 2");
      // console.log(req.sampleVariable);
      // res.send("2nd response!!");
      next();
    },
  ],
  (req, res, next) => {
    console.log("Handling user 3");
    // res.send("3rd response!!");
    next();
  },
  (req, res, next) => {
    console.log("Handling user 4");
    res.send("4th response!!");
  }
);

// listening on port 3000
app.listen(3000, () => {
  console.log("Listening on 3000");
});
