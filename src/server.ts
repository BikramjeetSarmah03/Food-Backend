import "dotenv/config";

import app from "./app";
import { connectDatabase } from "./config/connectDatabase";

connectDatabase();

app.listen(4000, () => {
  console.log("Server started");
});
