import mongoose from "mongoose";

import { MONGO_URI } from ".";

export const connectDatabase = async () => {
  await mongoose
    .connect(MONGO_URI || "")
    .then((data) => {
      console.log(`Database connected at HOST:${data.connection.host}`);
    })
    .catch((err) => {
      console.log("Error While connecting to database: ", err.message);
    });
};
