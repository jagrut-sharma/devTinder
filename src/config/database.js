const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Jagrut:DAAEruvk3ofKQL69@namastenode.e2oi4.mongodb.net/devTinder  "
  );
};

module.exports = connectDB;
