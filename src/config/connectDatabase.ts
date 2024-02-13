import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDatabase = async () => {
  await mongoose
    .connect(MONGO_URI)
    .then((data) => {
      console.log(`Database connected at HOST:${data.connection.host}`);
    })
    .catch((err) => {
      console.log("Error While connecting to database: ", err.message);
    });
};
