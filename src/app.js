const express = require("express");
const bcrypt = require("bcrypt");
// const { adminAuth, userAuth } = require("./middleware/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// creates a server:
const app = express();
app.use(express.json());
app.use(cookieParser());

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
  try {
    // data validation
    validateSignupData(req);

    // extract data what is necessary => do not send unnecessary data to API:
    const { firstName, userName, email, password } = req.body;

    //hasing the password:
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only pass the things that it requires
    const user = new User({
      firstName,
      userName,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.send("Added User Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    if (!password) {
      throw new Error("Password required");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "DEVTinder@24");
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token");
    }

    const { _id } = jwt.verify(token, "DEVTinder@24");
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("No user found");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
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
