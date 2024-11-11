const { response } = require("express");
const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    if (response) {
      console.log("connected to DB");
    }
  } catch (error) {
    console.log(error);
  }
};
conn();
