import express from "express";
import "dotenv/config";

import routes from "./routes";
import { connectDatabase } from "./config/connectDatabase";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

connectDatabase();

app.listen(4000, () => {
  console.log("Server started");
});
