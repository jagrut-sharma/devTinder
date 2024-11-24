const express = require("express");
// const { adminAuth, userAuth } = require("./middleware/auth");
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

app.patch("/user/:userId", async (req, res) => {
  console.log(req.body);
  const userID = req?.params?.userId;
  const updatedData = req.body;
  const UPDATES_ALLOWED = [
    "lastName",
    "userName",
    "password",
    "photoUrl",
    "aboutUs",
    "skills",
  ];

  const updateRequested = Object.keys(req.body);
  const isUpdateAllowed = updateRequested.every((update) =>
    UPDATES_ALLOWED.includes(update)
  );

  try {
    // Validations:
    if (!isUpdateAllowed) {
      throw new Error("Invalid update, Not allowed");
    }

    if (updatedData?.skills?.length > 5) {
      throw new Error("Skills cannot be more than 5");
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
