const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");
const connectDB = require("./config/database");
const User = require("./models/user");

// creates a server:
const app = express();
app.use(express.json());

// Request Handlers:
app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    email: "virat@kohli.com",
    password: "virat@123",
    age: 31,
    gender: "male",
  });

  try {
    await user.save();
    res.send("Added User Successfully");
  } catch (error) {
    res.status(400).send("Error occured in adding user");
    console.log(error);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");

    // listening on port 3000
    app.listen(3000, () => {
      console.log("Listening on 3000");
    });
  })
  .catch(() => console.log("Error connecting to the database"));
