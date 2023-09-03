import mongoose from "mongoose";
require("dotenv").config();

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("Invalid Environment URL");
    }
    const connnect = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "DataBase Connected : ",
      connnect.connection.host,
      connnect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export { connectDb };
