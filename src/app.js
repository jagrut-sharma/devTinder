const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middleware/auth");
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

    const isPasswordValid = user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 86400000), // 7 days
      });
      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent a connection request");
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
