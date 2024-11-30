const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  validateEditPassword,
} = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({ message: "Updated successfully", data: loggedInUser });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword, oldPassword } = req.body;

    const user = req.user;

    if (!oldPassword) {
      throw new Error("Current Password required");
    }

    if (!newPassword) {
      throw new Error("New Password required");
    }

    const isPasswordValid = await user.validatePassword(oldPassword);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      throw new Error("Invalid Current Password");
    }

    if (!validateEditPassword(newPassword)) {
      throw new Error("Invalid New Password");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;

    await user.save();
    res.send("Password changed successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
