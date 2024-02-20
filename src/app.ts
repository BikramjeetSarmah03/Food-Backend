import express from "express";
import path from "path";

import routes from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use("/api/v1", routes);

export default app;
