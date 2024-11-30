const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;
