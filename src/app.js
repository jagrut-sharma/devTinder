const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");
const connectDB = require("./config/database");
const User = require("./models/user");

// creates a server:
const app = express();
app.use(express.json());

// Request Handlers:
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("Could not find the user");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users.length) {
      res.status(404).send("Unable to find Users");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const user = new User(req.body);

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
