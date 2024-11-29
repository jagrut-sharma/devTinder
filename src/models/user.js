const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: { type: String, trim: true },
    userName: { type: String, default: "@default", required: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    age: { type: Number, min: 18, max: 100 },
    gender: {
      type: String,
      trim: true,
      // enum: ["male", "female", "other"],
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Please enter a correct gender");
        }
      },
      lowercase: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URl");
        }
      },
    },
    aboutUs: { type: String, default: "Hi! I'm on devTinder", trim: true },
    skills: {
      type: [String],
    },
    friends: [
      {
        name: String,
        location: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, "DEVTinder@24", {
    // expiresIn: "2h",
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordTypedByUser) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(
    passwordTypedByUser,
    user.password
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
