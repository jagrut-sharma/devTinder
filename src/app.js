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
  const user = new User(req.body);

  try {
    await user.save();
    res.send("Added User Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
    console.log(error);
  }
});

app.delete("/user", async (req, res) => {
  const userID = req.body.userID;
  try {
    // const deletedUser = await User.findByIdAndDelete({ _id: userID });
    const deletedUser = await User.findByIdAndDelete(userID);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  console.log(req.body);
  const userID = req.body._id;
  const updatedData = req.body;
  const UPDATES_NOT_ALLOWED = ["email", "age", "gender", "firstName"];

  const updateRequested = Object.keys(req.body);

  try {
    // Validations:
    if (
      updateRequested.some((update) => UPDATES_NOT_ALLOWED.includes(update))
    ) {
      throw new Error("Invalid update, Not allowed");
    }

    if (updatedData?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    // const deletedUser = await User.findByIdAndDelete({ _id: userID });
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userID },
      updatedData,
      {
        runValidators: true,
        returnDocument: "after",
      }
    );
    console.log(updatedUser);

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
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
