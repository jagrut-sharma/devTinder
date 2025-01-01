const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = [
  "userName",
  "gender",
  "age",
  "photoUrl",
  "aboutUs",
  "skills",
];

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // find connection requests present in the connection database and return it
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "like",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const connectedUsers = await ConnectionRequestModel.find({
    $or: [
      { fromUserId: loggedInUser._id, status: "accept" },
      {
        toUserId: loggedInUser._id,
        status: "accept",
      },
    ],
  })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  const data = connectedUsers.map((connection) => {
    if (connection.fromUserId._id.equals(loggedInUser._id)) {
      //   const { fromUserId, ...user } = connection.toObject();
      //   return user;
      return connection.toUserId;
    } else {
      //   const { toUserId, ...user } = connection.toObject();
      // return user;
      return connection.fromUserId;
    }
  });

  res.json({ message: "Successfully fetched users", data });
  //   res.json({ message: "Successfully fetched users", data: connectedUsers });
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUsers = new Set();

    connectionRequests.forEach((connectionRequest) => {
      hiddenUsers
        .add(connectionRequest.fromUserId.toString())
        .add(connectionRequest.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: feedUsers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
