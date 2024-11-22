const mongoose = require("mongoose");

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
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    age: { type: Number, min: 18, max: 100 },
    gender: {
      type: String,
      trim: true,
      // enum: ["male", "female", "other"],
      validate: (value) => {
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

module.exports = mongoose.model("User", userSchema);
