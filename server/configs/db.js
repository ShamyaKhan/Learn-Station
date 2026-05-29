const mongoose = require("mongoose");
const { MONGODB_URI } = require("../utils/constants");

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to Database!");
    });
    await mongoose.connect(`${MONGODB_URI}`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
