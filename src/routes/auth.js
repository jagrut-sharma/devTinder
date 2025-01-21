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
    const { firstName, lastName, email, password, age } = req.body;

    //hasing the password:
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only pass the things that it requires
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJwt();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 86400000), // 7 days
    });
    res.json({ message: "Added User Successfully", data: savedUser });
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

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 86400000), // 7 days
      });

      res.json({ message: "Login successful", data: user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logged out successfully");
});

module.exports = authRouter;
