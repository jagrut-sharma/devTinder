const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // find connection requests present in the connection database and return it
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "like",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "userName",
      "gender",
      "age",
      "photoUrl",
      "aboutUs",
      "skills",
    ]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
